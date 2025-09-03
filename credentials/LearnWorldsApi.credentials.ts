import {
	ICredentialType,
	NodePropertyTypes,
	ICredentialDataDecryptedObject,
	IHttpRequestOptions,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class LearnWorldsApi implements ICredentialType {
	name = 'learnWorldsApi';
	displayName = 'LearnWorlds API';
	documentationUrl = 'https://www.learnworlds.dev/docs/api/b6b6c2d4906e9-authentication';
	extends = ['httpBasicAuth'];
	icon = 'file:icons/learnworlds.svg';
	properties = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string' as NodePropertyTypes,
			default: '',
			required: true,
			description: 'Your LearnWorlds Client ID',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string' as NodePropertyTypes,
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
			type: 'string' as NodePropertyTypes,
			default: '',
			placeholder: 'your-school.learnworlds.com',
			required: true,
			description: 'Your LearnWorlds school domain',
		},
	];

	async authenticate(credentials: ICredentialDataDecryptedObject, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions> {
		const schoolDomain = credentials.schoolDomain as string;
		const tokenUrl = `https://${schoolDomain}/admin/api/oauth2/access_token`;
		
		const data = {
			client_id: credentials.clientId,
			client_secret: credentials.clientSecret,
			grant_type: 'client_credentials',
		};

		const formData = new URLSearchParams();
		formData.append('data', JSON.stringify(data));

		const response = await fetch(tokenUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Lw-Client': credentials.clientId as string,
				'Accept': 'application/json',
			},
			body: formData.toString(),
		});

		const responseData = await response.json();

		if (!response.ok) {
			throw new Error(`Authentication failed: ${response.statusText}`);
		}

		if (!responseData.success || !responseData.tokenData?.access_token) {
			throw new Error('Failed to get access token from LearnWorlds API');
		}

		const token = responseData.tokenData.access_token;

		// Set base URL if not already set
		if (!requestOptions.baseURL) {
			requestOptions.baseURL = `https://${schoolDomain}/admin/api`;
		}

		// Ensure URL starts with a forward slash if it's a path
		if (requestOptions.url && !requestOptions.url.startsWith('http')) {
			requestOptions.url = requestOptions.url.startsWith('/') ? requestOptions.url : `/${requestOptions.url}`;
		}

		requestOptions.headers = {
			...requestOptions.headers,
			'Authorization': `Bearer ${token}`,
			'Lw-Client': credentials.clientId as string,
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		};

		return requestOptions;
	}

	test: ICredentialTestRequest = {
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