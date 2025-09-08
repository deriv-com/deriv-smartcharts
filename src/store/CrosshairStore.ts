import { action, computed, observable, makeObservable } from 'mobx';
import Context from 'src/components/ui/Context';
import MainStore from '.';

class CrosshairStore {
    mainStore: MainStore;
    prev_arrow?: string;

    state?: number = 2;
    drawingTooltip: HTMLElement | null = null;
    indicatorTooltip: HTMLElement | null = null;

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            activeSymbol: computed,
            state: observable,
            toggleState: action.bound,
            setCrosshairState: action.bound,
        });

        this.mainStore = mainStore;
    }
    get activeSymbol() {
        return this.mainStore.chart.currentActiveSymbol;
    }

    get showOhl(): boolean {
        return this.mainStore.timeperiod.timeUnit !== 'tick' && this.mainStore.chartType.isCandle;
    }
    get context(): Context | null {
        return this.mainStore.chart.context;
    }

    get isChartReady() {
        return this.mainStore.state.isChartReady;
    }

    node = null;
    showChange = false;
    showSeries = false;
    showStudies = false;
    isDrawingRegistered = false;
    selectedDrawing = '';
    hoverOnScreen = false;
    isOverChartContainer = false;
    onCrosshairChanged: (state?: number) => void = () => null;
    cachedDx: number | null = null;
    cachedDy: number | null = null;
    layoutCrosshair = 0;

    onMouseMove = (dx: number, dy: number, _epoch: number, _quote: string) => {
        if (this.cachedDx === dx && this.cachedDy === dy) {
            return;
        }
        this.cachedDx = dx;
        this.cachedDy = dy;
        if (this.hoverOnScreen === false) {
            this.isOverChartContainer = true;
            this.hoverOnScreen = true;
        }
        if (!this.isOverChartContainer) return;

        if (this.layoutCrosshair) {
            this.setCrosshairState(this.layoutCrosshair);
            this.layoutCrosshair = 0;
        }

        this.updateVisibility(true);
    };

    onMouseOut = () => {
        this.isOverChartContainer = false;
        this.updateVisibility(false);
        this.hoverOnScreen = false;
    };

    toggleState() {
        const state = ((this.state as number) + 1) % 3;
        this.setCrosshairState(state);
    }

    setCrosshairState(state?: number) {
        if (!this.context) {
            return;
        }
        this.state = state;

        this.mainStore.state.crosshairState = state;
        this.mainStore.state.saveLayout();
        this.onCrosshairChanged(this.state);

        const isCrosshairVisible = state !== 0;
        this.mainStore.chartAdapter.flutterChart?.config.updateCrosshairVisibility(isCrosshairVisible);
    }

    updateVisibility = (_visible: boolean) => {
        // TODO: update chrosshair visibility
    };
}
export default CrosshairStore;
