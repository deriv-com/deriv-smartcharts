import { expect } from 'chai';
import sinon from 'sinon';
import { TGetQuotesRequest } from 'src/types';
import BinaryAPI from '../BinaryAPI';

// Feed requests ticks with granularity 0, which TGetQuotesRequest does not list.
const TICKS = 0 as unknown as TGetQuotesRequest['granularity'];

const history = { prices: [1.1, 1.2], times: [100, 101] };
const candles = [{ open: 1, high: 2, low: 0.5, close: 1.5, epoch: 120 }];

const createApi = ({ withHistoryStream = true } = {}) => {
    const unsubscribeQuotes = sinon.spy();
    const getQuotes = sinon.stub().resolves({ history });
    const subscribeQuotes = sinon.stub().returns(sinon.spy());
    const subscribeQuotesWithHistory = sinon.stub().resolves({ history });
    const api = new BinaryAPI(
        unsubscribeQuotes,
        getQuotes,
        subscribeQuotes,
        withHistoryStream ? subscribeQuotesWithHistory : undefined
    );

    return { api, unsubscribeQuotes, getQuotes, subscribeQuotes, subscribeQuotesWithHistory };
};

describe('BinaryAPI', () => {
    describe('canSubscribeWithHistory', () => {
        it('is false when the host does not provide subscribeQuotesWithHistory', () => {
            expect(createApi({ withHistoryStream: false }).api.canSubscribeWithHistory).to.equal(false);
        });

        it('is true when the host provides subscribeQuotesWithHistory', () => {
            expect(createApi().api.canSubscribeWithHistory).to.equal(true);
        });
    });

    describe('getQuotes', () => {
        it('passes the normalised request to the host and returns the tick history', async () => {
            const { api, getQuotes } = createApi();

            const result = await api.getQuotes({ symbol: 'R_100', count: '500', end: '200', start: '50' });

            expect(getQuotes.firstCall.args[0]).to.deep.equal({
                symbol: 'R_100',
                granularity: undefined,
                count: 500,
                start: 50,
                end: 200,
            });
            expect(result).to.deep.equal({ history });
        });

        it('returns candles when a granularity is set', async () => {
            const { api, getQuotes } = createApi();
            getQuotes.resolves({ candles });

            expect(await api.getQuotes({ symbol: 'R_100', granularity: 60 })).to.deep.equal({ candles });
            expect(getQuotes.firstCall.args[0].count).to.equal(BinaryAPI.DEFAULT_COUNT);
        });

        it('rejects a tick response without history', async () => {
            const { api, getQuotes } = createApi();
            getQuotes.resolves({});

            const error = await api.getQuotes({ symbol: 'R_100' }).catch((e: Error) => e);

            expect((error as Error).message).to.equal('Invalid tick history response format');
        });
    });

    describe('subscribeQuotes', () => {
        it('still subscribes with only the symbol and granularity', () => {
            const { api, subscribeQuotes } = createApi({ withHistoryStream: false });
            const callback = sinon.spy();

            api.subscribeQuotes({ symbol: 'R_100', granularity: 60, count: 1000 }, callback);

            expect(subscribeQuotes.firstCall.args).to.deep.equal([{ symbol: 'R_100', granularity: 60 }, callback]);
        });
    });

    describe('subscribeQuotesWithHistory', () => {
        it('opens the stream with the history parameters and resolves with the history', async () => {
            const { api, subscribeQuotesWithHistory } = createApi();
            const callback = sinon.spy();

            const result = await api.subscribeQuotesWithHistory(
                { symbol: 'R_100', granularity: TICKS, count: 1000 },
                callback
            );

            expect(subscribeQuotesWithHistory.calledOnce).to.equal(true);
            expect(subscribeQuotesWithHistory.firstCall.args).to.deep.equal([
                { symbol: 'R_100', granularity: TICKS, count: 1000 },
                callback,
            ]);
            expect(result).to.deep.equal({ history });
        });

        it('uses the default count when none is given', async () => {
            const { api, subscribeQuotesWithHistory } = createApi();

            await api.subscribeQuotesWithHistory({ symbol: 'R_100', granularity: TICKS }, sinon.spy());

            expect(subscribeQuotesWithHistory.firstCall.args[0].count).to.equal(BinaryAPI.DEFAULT_COUNT);
        });

        it('sends start instead of count when a start is given', async () => {
            const { api, subscribeQuotesWithHistory } = createApi();

            await api.subscribeQuotesWithHistory(
                { symbol: 'R_100', granularity: TICKS, count: 1000, start: '150' },
                sinon.spy()
            );

            expect(subscribeQuotesWithHistory.firstCall.args[0]).to.deep.equal({
                symbol: 'R_100',
                granularity: TICKS,
                start: 150,
            });
        });

        it('returns candles when a granularity is set', async () => {
            const { api, subscribeQuotesWithHistory } = createApi();
            subscribeQuotesWithHistory.resolves({ candles });

            const result = await api.subscribeQuotesWithHistory({ symbol: 'R_100', granularity: 60 }, sinon.spy());

            expect(result).to.deep.equal({ candles });
        });

        it('registers the stream so forget stops it with unsubscribeQuotes', async () => {
            const { api, unsubscribeQuotes } = createApi();
            const callback = sinon.spy();
            await api.subscribeQuotesWithHistory({ symbol: 'R_100', granularity: TICKS, count: 1000 }, callback);

            api.forget({ symbol: 'R_100', granularity: TICKS });

            expect(unsubscribeQuotes.calledOnce).to.equal(true);
            const [request, unsubscribedCallback] = unsubscribeQuotes.firstCall.args;
            expect(request).to.include({ symbol: 'R_100', style: 'ticks', subscribe: 1, count: 1000 });
            expect(unsubscribedCallback).to.equal(callback);
            expect(api.streamRequests).to.deep.equal({});
        });

        it('rejects when the host rejects', async () => {
            const { api, subscribeQuotesWithHistory } = createApi();
            subscribeQuotesWithHistory.rejects(new Error('MarketIsClosed'));

            const error = await api
                .subscribeQuotesWithHistory({ symbol: 'R_100', granularity: TICKS }, sinon.spy())
                .catch((e: Error) => e);

            expect((error as Error).message).to.equal('MarketIsClosed');
        });

        it('rejects a tick response without history', async () => {
            const { api, subscribeQuotesWithHistory } = createApi();
            subscribeQuotesWithHistory.resolves({});

            const error = await api
                .subscribeQuotesWithHistory({ symbol: 'R_100', granularity: TICKS }, sinon.spy())
                .catch((e: Error) => e);

            expect((error as Error).message).to.equal('Invalid tick history response format');
        });

        it('rejects when the host does not provide subscribeQuotesWithHistory', async () => {
            const { api } = createApi({ withHistoryStream: false });

            const error = await api
                .subscribeQuotesWithHistory({ symbol: 'R_100', granularity: TICKS }, sinon.spy())
                .catch((e: Error) => e);

            expect((error as Error).message).to.equal('No subscribeQuotesWithHistory function provided');
        });
    });

    describe('forget', () => {
        it('does nothing when no stream is registered for the key', () => {
            const { api, unsubscribeQuotes } = createApi();

            api.forget({ symbol: 'R_100', granularity: TICKS });

            expect(unsubscribeQuotes.called).to.equal(false);
        });

        it('keeps a newer stream when asked to forget an older callback', async () => {
            const { api, unsubscribeQuotes } = createApi();
            const older = sinon.spy();
            const newer = sinon.spy();
            await api.subscribeQuotesWithHistory({ symbol: 'R_100', granularity: TICKS }, older);
            await api.subscribeQuotesWithHistory({ symbol: 'R_100', granularity: TICKS }, newer);

            api.forget({ symbol: 'R_100', granularity: TICKS }, older);

            expect(unsubscribeQuotes.called).to.equal(false);
            expect(api.streamRequests['R_100-0'].callback).to.equal(newer);
        });

        it('stops the stream when the callback matches', async () => {
            const { api, unsubscribeQuotes } = createApi();
            const callback = sinon.spy();
            await api.subscribeQuotesWithHistory({ symbol: 'R_100', granularity: TICKS }, callback);

            api.forget({ symbol: 'R_100', granularity: TICKS }, callback);

            expect(unsubscribeQuotes.calledOnce).to.equal(true);
        });
    });
});
