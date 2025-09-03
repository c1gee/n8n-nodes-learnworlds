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
        this.extends = ['httpBasicAuth'];
        this.icon = 'file:icons/learnworlds.svg';
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
        this.test = {
            request: {
                baseURL: '={{$credentials?.schoolDomain ? `https://${$credentials.schoolDomain}/admin/api` : ""}}',
                url: '/oauth2/access_token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Lw-Client': '={{$credentials?.clientId}}',
                    'Accept': 'application/json',
                },
                body: {
                    data: '={{JSON.stringify({client_id: $credentials?.clientId, client_secret: $credentials?.clientSecret, grant_type: "client_credentials"})}}',
                },
            },
        };
    }
    authenticate(credentials, requestOptions) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const schoolDomain = credentials.schoolDomain;
            const tokenUrl = `https://${schoolDomain}/admin/api/oauth2/access_token`;
            const data = {
                client_id: credentials.clientId,
                client_secret: credentials.clientSecret,
                grant_type: 'client_credentials',
            };
            const formData = new URLSearchParams();
            formData.append('data', JSON.stringify(data));
            const response = yield fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Lw-Client': credentials.clientId,
                    'Accept': 'application/json',
                },
                body: formData.toString(),
            });
            const responseData = yield response.json();
            if (!response.ok) {
                throw new Error(`Authentication failed: ${response.statusText}`);
            }
            if (!responseData.success || !((_a = responseData.tokenData) === null || _a === void 0 ? void 0 : _a.access_token)) {
                throw new Error('Failed to get access token from LearnWorlds API');
            }
            const token = responseData.tokenData.access_token;
            if (!requestOptions.baseURL) {
                requestOptions.baseURL = `https://${schoolDomain}/admin/api`;
            }
            if (requestOptions.url && !requestOptions.url.startsWith('http')) {
                requestOptions.url = requestOptions.url.startsWith('/') ? requestOptions.url : `/${requestOptions.url}`;
            }
            requestOptions.headers = Object.assign(Object.assign({}, requestOptions.headers), { 'Authorization': `Bearer ${token}`, 'Lw-Client': credentials.clientId, 'Accept': 'application/json', 'Content-Type': 'application/json' });
            return requestOptions;
        });
    }
}
exports.LearnWorldsApi = LearnWorldsApi;
//# sourceMappingURL=LearnWorldsApi.credentials.js.map