import { expect } from 'chai';
import sinon from 'sinon';
import { BinaryAPI } from 'src/binaryapi';
import { TGetQuotesRequest, TMainStore, TQuote } from 'src/types';
import RealtimeSubscription from '../RealtimeSubscription';

// Feed requests ticks with granularity 0, which TGetQuotesRequest does not list.
const TICKS = 0 as unknown as TGetQuotesRequest['granularity'];
const history = { prices: [1.1, 1.2], times: [100, 101] };
const tick = { epoch: 102, quote: 1.3, symbol: 'R_100', pip_size: 2 };
const mainStore = { state: { contractInfo: {}, shouldGetQuotes: false } } as unknown as TMainStore;

type THostCallback = (quote: TQuote) => void;

const createHost = ({ withHistoryStream = true } = {}) => {
    const host = {
        unsubscribeQuotes: sinon.spy(),
        getQuotes: sinon.stub().resolves({ history }),
        subscribeQuotes: sinon.stub().returns(sinon.spy()),
        subscribeQuotesWithHistory: sinon.stub().resolves({ history }),
    };
    const api = new BinaryAPI(
        host.unsubscribeQuotes,
        host.getQuotes,
        host.subscribeQuotes,
        withHistoryStream ? host.subscribeQuotesWithHistory : undefined
    );

    return { api, host };
};

const createSubscription = (api: BinaryAPI, request: Partial<TGetQuotesRequest> = {}) =>
    new RealtimeSubscription(
        { symbol: 'R_100', granularity: TICKS, count: 1000, ...request } as TGetQuotesRequest,
        api,
        mainStore
    );

describe('RealtimeSubscription', () => {
    describe('with subscribeQuotesWithHistory', () => {
        it('loads the history and opens the stream with one host call', async () => {
            const { api, host } = createHost();
            const subscription = createSubscription(api);

            const { quotes, response } = await subscription.initialFetch();

            expect(host.subscribeQuotesWithHistory.calledOnce).to.equal(true);
            expect(host.subscribeQuotesWithHistory.firstCall.args[0]).to.deep.equal({
                symbol: 'R_100',
                granularity: 0,
                count: 1000,
            });
            expect(host.getQuotes.called).to.equal(false);
            expect(host.subscribeQuotes.called).to.equal(false);
            expect(response).to.deep.equal({ history });
            expect(quotes.map(quote => quote.Close)).to.deep.equal([1.1, 1.2]);
            expect(subscription.lastStreamEpoch).to.equal(101);
        });

        it('emits streamed ticks and ignores messages without a tick or candle', async () => {
            const { api, host } = createHost();
            const subscription = createSubscription(api);
            const onChartData = sinon.spy();
            await subscription.initialFetch();
            subscription.onChartData(onChartData);
            const hostCallback: THostCallback = host.subscribeQuotesWithHistory.firstCall.args[1];

            hostCallback({ Date: '102', Close: 0 });
            hostCallback({ Date: '102', Close: tick.quote, tick });

            expect(onChartData.calledOnce).to.equal(true);
            expect(onChartData.firstCall.args[0][0]).to.include({ Close: 1.3 });
            expect(subscription.lastStreamEpoch).to.equal(102);
        });

        it('stops the stream through unsubscribeQuotes when forgotten', async () => {
            const { api, host } = createHost();
            const subscription = createSubscription(api);
            await subscription.initialFetch();

            subscription.forget();

            expect(host.unsubscribeQuotes.calledOnce).to.equal(true);
            expect(host.unsubscribeQuotes.firstCall.args[0]).to.include({ symbol: 'R_100', subscribe: 1 });
        });

        it('rejects and releases the stream when it fails before the history arrives', async () => {
            const { api, host } = createHost();
            host.subscribeQuotesWithHistory.rejects(new Error('Feed unavailable'));
            const subscription = createSubscription(api);

            const error = await subscription.initialFetch().catch((e: Error) => e);

            expect((error as Error).message).to.equal('Feed unavailable');
            expect(host.unsubscribeQuotes.calledOnce).to.equal(true);
            expect(api.streamRequests).to.deep.equal({});

            subscription.forget();
            expect(host.unsubscribeQuotes.calledOnce).to.equal(true);
        });

        it('rejects and releases the stream when the history is malformed', async () => {
            const { api, host } = createHost();
            host.subscribeQuotesWithHistory.resolves({});
            const subscription = createSubscription(api);

            const error = await subscription.initialFetch().catch((e: Error) => e);

            expect((error as Error).message).to.equal('Invalid tick history response format');
            expect(host.unsubscribeQuotes.calledOnce).to.equal(true);
        });

        it('keeps a newer stream for the same symbol when an older one fails', async () => {
            const { api, host } = createHost();
            let rejectOlder: (error: Error) => void = sinon.spy();
            host.subscribeQuotesWithHistory.onFirstCall().returns(
                new Promise((_, reject) => {
                    rejectOlder = reject;
                })
            );
            const older = createSubscription(api).initialFetch();
            await createSubscription(api).initialFetch();

            rejectOlder(new Error('Feed unavailable'));
            await older.catch(() => undefined);

            expect(host.unsubscribeQuotes.called).to.equal(false);
            expect(api.streamRequests['R_100-0'].callback).to.equal(host.subscribeQuotesWithHistory.secondCall.args[1]);
        });

        it('resumes from the last streamed epoch instead of a count', async () => {
            const { api, host } = createHost();
            const subscription = createSubscription(api);
            await subscription.initialFetch();
            subscription.pause();

            await subscription.resume();

            expect(host.subscribeQuotesWithHistory.secondCall.args[0]).to.deep.equal({
                symbol: 'R_100',
                granularity: 0,
                start: 101,
            });
        });

        it('requests candles for a granularity', async () => {
            const { api, host } = createHost();
            const candles = [{ open: 1, high: 2, low: 0.5, close: 1.5, epoch: 120 }];
            host.subscribeQuotesWithHistory.resolves({ candles });
            const subscription = createSubscription(api, { granularity: 60 });

            const { quotes } = await subscription.initialFetch();

            expect(host.subscribeQuotesWithHistory.firstCall.args[0]).to.include({ granularity: 60 });
            expect(quotes[0]).to.include({ Open: 1, High: 2, Low: 0.5, Close: 1.5 });
            expect(subscription.lastStreamEpoch).to.equal(120);
        });
    });

    describe('without subscribeQuotesWithHistory', () => {
        it('loads the history with getQuotes and then subscribes', async () => {
            const { api, host } = createHost({ withHistoryStream: false });
            const subscription = createSubscription(api);

            const { quotes } = await subscription.initialFetch();

            expect(host.getQuotes.calledOnce).to.equal(true);
            expect(host.subscribeQuotes.calledOnce).to.equal(true);
            expect(host.getQuotes.calledBefore(host.subscribeQuotes)).to.equal(true);
            expect(host.subscribeQuotes.firstCall.args[0]).to.deep.equal({ symbol: 'R_100', granularity: 0 });
            expect(host.subscribeQuotesWithHistory.called).to.equal(false);
            expect(quotes.map(quote => quote.Close)).to.deep.equal([1.1, 1.2]);
        });

        it('emits streamed ticks', async () => {
            const { api, host } = createHost({ withHistoryStream: false });
            const subscription = createSubscription(api);
            const onChartData = sinon.spy();
            await subscription.initialFetch();
            subscription.onChartData(onChartData);

            host.subscribeQuotes.firstCall.args[1]({ Date: '102', Close: tick.quote, tick });

            expect(onChartData.calledOnce).to.equal(true);
        });
    });
});
