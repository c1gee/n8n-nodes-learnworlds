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
const LearnWorldsApi_credentials_1 = require("../credentials/LearnWorldsApi.credentials");
const dotenv = require("dotenv");
dotenv.config({ path: '.env' });
describe('LearnWorlds API Credentials', () => {
    const credentials = new LearnWorldsApi_credentials_1.LearnWorldsApi();
    it('should authenticate successfully with valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const credentialsData = {
            clientId: process.env.LEARNWORLDS_CLIENT_ID || '',
            clientSecret: process.env.LEARNWORLDS_CLIENT_SECRET || '',
            schoolDomain: process.env.LEARNWORLDS_SCHOOL_DOMAIN || '',
        };
        expect(credentialsData.clientId).not.toBe('');
        expect(credentialsData.clientSecret).not.toBe('');
        expect(credentialsData.schoolDomain).not.toBe('');
        const requestOptions = {
            url: '/v2/courses',
            method: 'GET',
            headers: {},
        };
        try {
            const result = yield credentials.authenticate(credentialsData, requestOptions);
            expect(result.headers).toBeDefined();
            expect(result.headers['Lw-Client']).toBe(credentialsData.clientId);
            expect(result.headers['Authorization']).toMatch(/^Bearer /);
            expect(result.headers['Accept']).toBe('application/json');
            expect(result.headers['Content-Type']).toBe('application/json');
            expect(result.url).toBe(`https://${credentialsData.schoolDomain}/admin/api/v2/courses`);
            console.log('Authentication successful!');
            console.log('Headers:', result.headers);
            console.log('URL:', result.url);
        }
        catch (error) {
            console.error('Authentication failed:', error);
            throw error;
        }
    }));
    it('should have proper test request configuration', () => {
        expect(credentials.test).toBeDefined();
        expect(credentials.test.request).toBeDefined();
        expect(credentials.test.request.method).toBe('GET');
        expect(credentials.test.request.url).toBe('/v2/courses');
        expect(credentials.test.request.headers['Accept']).toBe('application/json');
    });
});
//# sourceMappingURL=credentials.test.js.map