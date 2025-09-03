"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearnWorldsApi = void 0;
class LearnWorldsApi {
    constructor() {
        this.name = 'learnWorldsApi';
        this.displayName = 'LearnWorlds API';
        this.documentationUrl = 'https://www.learnworlds.dev/docs/api/b6b6c2d4906e9-authentication';
        this.properties = [
            {
                displayName: 'Client ID',
                name: 'clientId',
                type: 'string',
                default: '',
                required: true,
                description: 'Your LearnWorlds Client ID',
            },
            {
                displayName: 'Client Secret',
                name: 'clientSecret',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'Your LearnWorlds Client Secret',
            },
            {
                displayName: 'School Domain',
                name: 'schoolDomain',
                type: 'string',
                default: '',
                placeholder: 'your-school.learnworlds.com',
                required: true,
                description: 'Your LearnWorlds school domain',
            },
        ];
        this.tokenCache = {};
    }
    getAccessToken(credentials) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `${credentials.clientId}:${credentials.schoolDomain}`;
            const cachedToken = this.tokenCache[cacheKey];
            if (cachedToken && cachedToken.expiresAt > Date.now()) {
                return cachedToken.token;
            }
            const tokenResponse = yield fetch(`https://${credentials.schoolDomain}/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Lw-Client': credentials.clientId,
                },
                body: JSON.stringify({
                    grant_type: 'client_credentials',
                    client_id: credentials.clientId,
                    client_secret: credentials.clientSecret,
                }),
            });
            const tokenData = yield tokenResponse.json();
            if (!tokenData.success || !((_a = tokenData.tokenData) === null || _a === void 0 ? void 0 : _a.access_token)) {
                throw new Error('Failed to authenticate with LearnWorlds API');
            }
            this.tokenCache[cacheKey] = {
                token: tokenData.tokenData.access_token,
                expiresAt: Date.now() + (tokenData.tokenData.expires_in * 900),
            };
            return tokenData.tokenData.access_token;
        });
    }
    authenticate(credentials, requestOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield this.getAccessToken(credentials);
            requestOptions.headers = Object.assign(Object.assign({}, requestOptions.headers), { 'Lw-Client': credentials.clientId, 'Authorization': `Bearer ${accessToken}` });
            return requestOptions;
        });
    }
}
exports.LearnWorldsApi = LearnWorldsApi;
//# sourceMappingURL=LearnWorldsApi.credentials.js.map