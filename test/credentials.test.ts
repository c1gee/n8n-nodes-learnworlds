import { LearnWorldsApi } from '../credentials/LearnWorldsApi.credentials';
import { ICredentialDataDecryptedObject, IHttpRequestOptions } from 'n8n-workflow';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

describe('LearnWorlds API Credentials', () => {
    const credentials = new LearnWorldsApi();
    
    it('should authenticate successfully with valid credentials', async () => {
        const credentialsData: ICredentialDataDecryptedObject = {
            clientId: process.env.LEARNWORLDS_CLIENT_ID || '',
            clientSecret: process.env.LEARNWORLDS_CLIENT_SECRET || '',
            schoolDomain: process.env.LEARNWORLDS_SCHOOL_DOMAIN || '',
        };

        // Verify that credentials are set
        expect(credentialsData.clientId).not.toBe('');
        expect(credentialsData.clientSecret).not.toBe('');
        expect(credentialsData.schoolDomain).not.toBe('');

        const requestOptions: IHttpRequestOptions = {
            url: '/v2/courses',
            method: 'GET',
            headers: {},
        };

        try {
            const result = await credentials.authenticate(credentialsData, requestOptions);
            
            // Verify headers are set correctly
            expect(result.headers).toBeDefined();
            expect(result.headers['Lw-Client']).toBe(credentialsData.clientId);
            expect(result.headers['Authorization']).toMatch(/^Bearer /);
            expect(result.headers['Accept']).toBe('application/json');
            expect(result.headers['Content-Type']).toBe('application/json');
            
            // Verify URL is properly formatted
            expect(result.url).toBe(`https://${credentialsData.schoolDomain}/admin/api/v2/courses`);
            
            console.log('Authentication successful!');
            console.log('Headers:', result.headers);
            console.log('URL:', result.url);
        } catch (error) {
            console.error('Authentication failed:', error);
            throw error;
        }
    });

    it('should have proper test request configuration', () => {
        expect(credentials.test).toBeDefined();
        expect(credentials.test.request).toBeDefined();
        expect(credentials.test.request.method).toBe('GET');
        expect(credentials.test.request.url).toBe('/v2/courses');
        expect(credentials.test.request.headers['Accept']).toBe('application/json');
    });
}); 