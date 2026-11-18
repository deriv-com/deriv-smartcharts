import {
    TGetQuotes,
    TSubscribeQuotes,
    TSubscribeQuotesWithHistory,
    TGetQuotesRequest,
    TGetQuotesResult,
    TGranularity,
    TUnsubscribeQuotes,
    TResponseAPICallback,
} from 'src/types';

export default class BinaryAPI {
    unsubscribeQuotes: TUnsubscribeQuotes;
    _getQuotes: TGetQuotes;
    _subscribeQuotes: TSubscribeQuotes;
    _subscribeQuotesWithHistory?: TSubscribeQuotesWithHistory;
    static get DEFAULT_COUNT() {
        return 1000;
    }
    streamRequests: Record<string, { request: TGetQuotesRequest; callback: TResponseAPICallback }> = {};


    constructor(
        unsubscribeQuotes: TUnsubscribeQuotes,
        getQuotes: TGetQuotes,
        subscribeQuotes: TSubscribeQuotes,
        subscribeQuotesWithHistory?: TSubscribeQuotesWithHistory,
    ) {
        this.unsubscribeQuotes = unsubscribeQuotes;
        this._getQuotes = getQuotes;
        this._subscribeQuotes = subscribeQuotes;
        this._subscribeQuotesWithHistory = subscribeQuotesWithHistory;
    }

    /**
     * Whether the host opens a live stream and its history in one request.
     */
    get canSubscribeWithHistory() {
        return typeof this._subscribeQuotesWithHistory === 'function';
    }

    /**
     * Get tick history for a symbol
     * @param params Parameters for the tick history request
     * @returns A Promise that resolves to a TGetQuotesResult
     */
    async getQuotes(params: TGetQuotesRequest): Promise<TGetQuotesResult> {
        if (this._getQuotes) {
            const quotes = await this._getQuotes({
                ...BinaryAPI.toHistoryParams(params),
                end: typeof params.end === 'string' ? parseInt(params.end, 10) : params.end,
            });

            return BinaryAPI.toQuotesResult(params, quotes);
        }

        // If no custom getQuotes function is provided, return a default empty response
        throw new Error('No getQuotes function provided');
    }
    subscribeQuotes(params: TGetQuotesRequest, callback: TResponseAPICallback) {
        this._registerStream(params, callback);

        // Send a copy of the request, in case it gets mutated outside
        this._subscribeQuotes({ symbol: params.symbol, granularity: params.granularity }, callback);
    }
    /**
     * Open a live stream and get its history with one request. Resolves with the history in the
     * same shape as getQuotes; later ticks or candles go to the callback. Stop it with forget.
     */
    async subscribeQuotesWithHistory(
        params: TGetQuotesRequest,
        callback: TResponseAPICallback
    ): Promise<TGetQuotesResult> {
        if (!this._subscribeQuotesWithHistory) {
            throw new Error('No subscribeQuotesWithHistory function provided');
        }
        this._registerStream(params, callback);

        const { symbol, count, start } = BinaryAPI.toHistoryParams(params);
        const granularity = params.granularity as TGranularity;
        // `start` replaces `count`, as in the request createGetQuotesRequest builds
        const historyParams = start ? { symbol, granularity, start } : { symbol, granularity, count };
        const quotes = await this._subscribeQuotesWithHistory(historyParams, callback);

        return BinaryAPI.toQuotesResult(params, quotes);
    }
    /**
     * Stop the stream registered for this symbol and granularity. With a callback, only stop it
     * while it is still the one that callback opened, so a newer stream for the same key survives.
     */
    forget(params: { symbol: string; granularity: TGranularity }, callback?: TResponseAPICallback) {
        const key = this._getKey(params as TGetQuotesRequest);
        if (!this.streamRequests[key]) return;
        const { request, callback: streamCallback } = this.streamRequests[key];
        if (callback && callback !== streamCallback) return;
        delete this.streamRequests[key];
        return this.unsubscribeQuotes(request, streamCallback);
    }
    _registerStream(params: TGetQuotesRequest, callback: TResponseAPICallback) {
        const key = this._getKey(params);
        const request = BinaryAPI.createGetQuotesRequest({ ...params, subscribe: 1 });
        this.streamRequests[key] = { request, callback };
    }
    static toHistoryParams(params: TGetQuotesRequest) {
        return {
            symbol: params.symbol,
            granularity: params.granularity as number,
            count:
                typeof params.count === 'string'
                    ? parseInt(params.count, 10)
                    : params.count || BinaryAPI.DEFAULT_COUNT,
            start: typeof params.start === 'string' ? parseInt(params.start, 10) : params.start,
        };
    }
    static toQuotesResult(params: TGetQuotesRequest, quotes: TGetQuotesResult): TGetQuotesResult {
        if (params.granularity) {
            return {
                candles: quotes.candles,
            };
        }

        // For ticks style
        if (quotes.history && quotes.history.times && quotes.history.prices) {
            const times = quotes.history.times;
            const prices = quotes.history.prices;
            return {
                history: {
                    times,
                    prices,
                },
            };
        }

        // If neither candles nor history is available, throw an error
        throw new Error('Invalid tick history response format');
    }
    static createGetQuotesRequest({
        symbol,
        granularity,
        start,
        end,
        subscribe,
        adjust_start_time = 1,
        count,
    }: TGetQuotesRequest): TGetQuotesRequest {
        const request: TGetQuotesRequest = {
            symbol,
            style: granularity ? 'candles' : 'ticks',
            start,
            end,
            count: count || BinaryAPI.DEFAULT_COUNT,
        };
        if (granularity) {
            // granularity will only be set if style=candles
            request.granularity = +granularity as TGetQuotesRequest['granularity'];
        }
        if (adjust_start_time) {
            request.adjust_start_time = adjust_start_time;
        }
        if (subscribe) {
            request.subscribe = 1;
        }
        if (start) {
            delete request.count;
            request.start = start;
        }
        if (end) {
            request.end = end;
        }
        return request;
    }
    _getKey({ symbol, granularity }: TGetQuotesRequest) {
        return `${symbol}-${granularity}`;
    }
}
