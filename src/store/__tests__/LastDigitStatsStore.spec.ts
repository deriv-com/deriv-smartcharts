import { expect } from 'chai';
import sinon from 'sinon';
import { TMainStore, TQuote } from 'src/types';
import LastDigitStatsStore from '../LastDigitStatsStore';

type TMasterDataUpdate = TQuote & { Close: number };

const COUNT = 1000;
// Prices ending in 0..9 in turn, so each digit is counted COUNT / 10 times
const tickHistory = (count = COUNT) => ({
    history: {
        prices: Array.from({ length: count }, (_, i) => 100 + (i % 10) / 100),
        times: Array.from({ length: count }, (_, i) => i),
    },
});

const createStore = ({ isVisible = true, symbol = 'Volatility 100 Index' } = {}) => {
    const api = { getQuotes: sinon.stub().resolves(tickHistory()) };
    const mainStore = {
        chart: {
            context: {},
            api,
            currentActiveSymbol: { symbol: 'R_100', name: symbol, decimal_places: 2 },
            feed: {
                onMasterDataUpdate: sinon.spy(),
                offMasterDataUpdate: sinon.spy(),
                onMasterDataReinitialize: sinon.spy(),
            },
        },
        state: { showLastDigitStats: isVisible },
        lastDigitStats: undefined as LastDigitStatsStore | undefined,
    };
    const store = new LastDigitStatsStore(mainStore as unknown as TMainStore);
    mainStore.lastDigitStats = store;

    return { api, mainStore, store };
};

const R_50 = { symbol: 'R_50', name: 'Volatility 50 Index', decimal_places: 2 };

const tick = (quote: number) =>
    ({ Close: quote, tick: { epoch: 1, quote, symbol: 'R_100', pip_size: 2 } } as unknown as TMasterDataUpdate);

describe('LastDigitStatsStore', () => {
    describe('when the chart loads tick history', () => {
        it('counts its ticks and sends no second request on the first tick', async () => {
            const { api, mainStore, store } = createStore();

            mainStore.chart.currentActiveSymbol = R_50;
            await store.updateLastDigitStats(tickHistory());
            store.onMasterDataUpdate(tick(100.05));

            expect(api.getQuotes.called).to.equal(false);
            // 1000 counted ticks, then the oldest (a 0) leaves and a 5 arrives
            expect(store.digits).to.deep.equal([99, 100, 100, 100, 100, 101, 100, 100, 100, 100]);
        });

        it('requests the ticks once after candles, which hold none to count', async () => {
            const { api, store } = createStore();

            await store.updateLastDigitStats({ candles: [{ epoch: 60, open: 1, high: 2, low: 0.5, close: 1.5 }] });
            store.onMasterDataUpdate(tick(100.05));
            store.onMasterDataUpdate(tick(100.06));

            expect(api.getQuotes.calledOnce).to.equal(true);
            expect(api.getQuotes.firstCall.args[0]).to.deep.equal({ symbol: 'R_100', count: COUNT });
        });

        it('requests the ticks once when the history is not the full count', async () => {
            const { api, store } = createStore();

            await store.updateLastDigitStats(tickHistory(400));
            store.onMasterDataUpdate(tick(100.05));

            expect(api.getQuotes.calledOnce).to.equal(true);
        });

        it('requests the ticks for a symbol whose history it has not counted', async () => {
            const { api, mainStore, store } = createStore();

            await store.updateLastDigitStats(tickHistory());
            mainStore.chart.currentActiveSymbol = R_50;
            store.onMasterDataUpdate(tick(100.05));

            expect(api.getQuotes.calledOnce).to.equal(true);
            expect(api.getQuotes.firstCall.args[0]).to.deep.equal({ symbol: 'R_50', count: COUNT });
        });
    });

    describe('while hidden', () => {
        it('sends no request and leaves the last tick as it was', async () => {
            const { api, store } = createStore({ isVisible: false });

            await store.updateLastDigitStats({ candles: [] });
            store.onMasterDataUpdate(tick(100.05));

            expect(api.getQuotes.called).to.equal(false);
            expect(store.lastTick).to.equal(null);
        });

        it('requests fresh ticks on the first tick after being shown again', async () => {
            const { api, mainStore, store } = createStore();

            await store.updateLastDigitStats(tickHistory());
            mainStore.state.showLastDigitStats = false;
            store.onMasterDataUpdate(tick(100.05));
            expect(api.getQuotes.called).to.equal(false);

            mainStore.state.showLastDigitStats = true;
            store.onMasterDataUpdate(tick(100.06));

            expect(api.getQuotes.calledOnce).to.equal(true);
        });
    });
});
