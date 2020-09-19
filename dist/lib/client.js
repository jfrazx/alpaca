"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlpacaClient = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const http_method_enum_1 = __importDefault(require("http-method-enum"));
const qs_1 = __importDefault(require("qs"));
const parser_1 = require("./parser");
const urls_1 = __importDefault(require("./urls"));
const limiter_1 = require("limiter");
class AlpacaClient {
    constructor(options) {
        this.options = options;
        this.limiter = new limiter_1.RateLimiter(199, 'minute');
        this.parser = new parser_1.Parser();
    }
    async isAuthenticated() {
        try {
            await this.getAccount();
            return true;
        }
        catch {
            return false;
        }
    }
    async getAccount() {
        const rawAccount = await this.request(http_method_enum_1.default.GET, urls_1.default.rest.account, 'account');
        return this.parser.parseAccount(rawAccount);
    }
    async getOrder(params) {
        const rawOrder = await this.request(http_method_enum_1.default.GET, urls_1.default.rest.account, `orders/${params.order_id || params.client_order_id}?${qs_1.default.stringify({
            nested: params.nested,
        })}`);
        return this.parser.parseOrder(rawOrder);
    }
    async getOrders(params) {
        const rawOrders = await this.request(http_method_enum_1.default.GET, urls_1.default.rest.account, `orders?${qs_1.default.stringify(params)}`);
        return this.parser.parseOrders(rawOrders);
    }
    async placeOrder(params) {
        const rawOrder = await this.request(http_method_enum_1.default.POST, urls_1.default.rest.account, `orders`, params);
        return this.parser.parseOrder(rawOrder);
    }
    async replaceOrder(params) {
        const rawOrder = await this.request(http_method_enum_1.default.PATCH, urls_1.default.rest.account, `orders/${params.order_id}`, params);
        return this.parser.parseOrder(rawOrder);
    }
    async cancelOrder(params) {
        const rawOrder = await this.request(http_method_enum_1.default.DELETE, urls_1.default.rest.account, `orders/${params.order_id}`);
        return this.parser.parseOrder(rawOrder);
    }
    async cancelOrders() {
        const rawOrders = await this.request(http_method_enum_1.default.DELETE, urls_1.default.rest.account, `orders`);
        return this.parser.parseOrders(rawOrders);
    }
    async getPosition(params) {
        const rawPosition = await this.request(http_method_enum_1.default.GET, urls_1.default.rest.account, `positions/${params.symbol}`);
        return this.parser.parsePosition(rawPosition);
    }
    async getPositions() {
        const rawPositions = await this.request(http_method_enum_1.default.GET, urls_1.default.rest.account, `positions`);
        return this.parser.parsePositions(rawPositions);
    }
    async closePosition(params) {
        const rawOrder = await this.request(http_method_enum_1.default.DELETE, urls_1.default.rest.account, `positions/${params.symbol}`);
        return this.parser.parseOrder(rawOrder);
    }
    async closePositions() {
        const rawOrders = await this.request(http_method_enum_1.default.DELETE, urls_1.default.rest.account, `positions`);
        return this.parser.parseOrders(rawOrders);
    }
    getAsset(params) {
        return this.request(http_method_enum_1.default.GET, urls_1.default.rest.account, `assets/${params.asset_id_or_symbol}`);
    }
    getAssets(params) {
        return this.request(http_method_enum_1.default.GET, urls_1.default.rest.account, `assets?${qs_1.default.stringify(params)}`);
    }
    getWatchlist(params) {
        return this.request(http_method_enum_1.default.GET, urls_1.default.rest.account, `watchlists/${params.uuid}`);
    }
    getWatchlists() {
        return this.request(http_method_enum_1.default.GET, urls_1.default.rest.account, `watchlists`);
    }
    createWatchlist(params) {
        return this.request(http_method_enum_1.default.POST, urls_1.default.rest.account, `watchlists`, params);
    }
    updateWatchlist(params) {
        return this.request(http_method_enum_1.default.PUT, urls_1.default.rest.account, `watchlists/${params.uuid}`, params);
    }
    addToWatchlist(params) {
        return this.request(http_method_enum_1.default.POST, urls_1.default.rest.account, `watchlists/${params.uuid}`, params);
    }
    removeFromWatchlist(params) {
        return this.request(http_method_enum_1.default.DELETE, urls_1.default.rest.account, `watchlists/${params.uuid}/${params.symbol}`);
    }
    deleteWatchlist(params) {
        return this.request(http_method_enum_1.default.DELETE, urls_1.default.rest.account, `watchlists/${params.uuid}`);
    }
    getCalendar(params) {
        return this.request(http_method_enum_1.default.GET, urls_1.default.rest.account, `calendar?${qs_1.default.stringify(params)}`);
    }
    getClock() {
        return this.request(http_method_enum_1.default.GET, urls_1.default.rest.account, `clock`);
    }
    getAccountConfigurations() {
        return this.request(http_method_enum_1.default.GET, urls_1.default.rest.account, `account/configurations`);
    }
    updateAccountConfigurations(params) {
        return this.request(http_method_enum_1.default.PATCH, urls_1.default.rest.account, `account/configurations`, params);
    }
    getAccountActivities(params) {
        return this.request(http_method_enum_1.default.GET, urls_1.default.rest.account, `account/activities/${params.activity_type}?${qs_1.default.stringify(params)}`);
    }
    getPortfolioHistory(params) {
        return this.request(http_method_enum_1.default.GET, urls_1.default.rest.account, `account/portfolio/history?${qs_1.default.stringify(params)}`);
    }
    getBars(params) {
        var transformed = {};
        // join the symbols into a comma-delimited string
        transformed = params;
        transformed['symbols'] = params.symbols.join(',');
        return this.request(http_method_enum_1.default.GET, urls_1.default.rest.market_data, `bars/${params.timeframe}?${qs_1.default.stringify(params)}`);
    }
    getLastTrade(params) {
        return this.request(http_method_enum_1.default.GET, urls_1.default.rest.market_data, `last/stocks/${params.symbol}`);
    }
    getLastQuote(params) {
        return this.request(http_method_enum_1.default.GET, urls_1.default.rest.market_data, `last_quote/stocks/${params.symbol}`);
    }
    request(method, url, endpoint, data) {
        // modify the base url if paper is true
        if (this.options.paper && url == urls_1.default.rest.account) {
            url = urls_1.default.rest.account.replace('api.', 'paper-api.');
        }
        // convert any dates to ISO 8601 for Alpaca
        if (data) {
            for (let [key, value] of Object.entries(data)) {
                if (value instanceof Date) {
                    data[key] = value.toISOString();
                }
            }
        }
        return new Promise(async (resolve, reject) => {
            // do rate limiting
            if (this.options.rate_limit) {
                await new Promise((resolve) => this.limiter.removeTokens(1, resolve));
            }
            await node_fetch_1.default(`${url}/${endpoint}`, {
                method: method,
                headers: {
                    'APCA-API-KEY-ID': this.options.credentials.key,
                    'APCA-API-SECRET-KEY': this.options.credentials.secret,
                },
                body: JSON.stringify(data),
            })
                .then(
            // if json parse fails we default to an empty object
            async (response) => (await response.json().catch(() => false)) || {})
                .then((json) => 'code' in json && 'message' in json ? reject(json) : resolve(json))
                .catch(reject);
        });
    }
}
exports.AlpacaClient = AlpacaClient;
