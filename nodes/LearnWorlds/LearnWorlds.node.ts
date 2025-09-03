import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class LearnWorlds implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LearnWorlds',
		name: 'learnWorlds',
		icon: 'file:learnworlds.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with LearnWorlds API',
		defaults: {
			name: 'LearnWorlds',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'learnWorldsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Course',
						value: 'course',
					},
				],
				default: 'course',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'course',
						],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all courses',
						action: 'Get all courses',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: {
					show: {
						operation: [
							'getAll',
						],
						resource: [
							'course',
						],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
				},
				displayOptions: {
					show: {
						operation: [
							'getAll',
						],
						resource: [
							'course',
						],
						returnAll: [
							false,
						],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		let responseData;

		try {
			const credentials = await this.getCredentials('learnWorldsApi');
			const { schoolDomain, clientId, clientSecret } = credentials as {
				schoolDomain: string;
				clientId: string;
				clientSecret: string;
			};

			// Get the LearnWorlds domain from environment variable
			const learnWorldsDomain = process.env.LEARNWORLDS_DOMAIN || 'staging.b2bea.org';

			// First, get the access token
			const tokenResponse = await this.helpers.request({
				method: 'POST',
				uri: `https://${learnWorldsDomain}/oauth2/access_token`,
				form: {
					grant_type: 'client_credentials',
					client_id: clientId,
					client_secret: clientSecret,
				},
				json: true,
			});

			const accessToken = tokenResponse.access_token;

			if (resource === 'course') {
				if (operation === 'getAll') {
					const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
					const limit = returnAll ? undefined : this.getNodeParameter('limit', 0) as number;

					const baseUrl = `https://${learnWorldsDomain}/api/v2`;
					const options = {
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'Content-Type': 'application/json',
						},
						method: 'GET',
						uri: `${baseUrl}/courses`,
						json: true,
					};

					responseData = await this.helpers.request(options);

					if (limit) {
						responseData = responseData.slice(0, limit);
					}

					const executionData = responseData.map((item: object) => ({
						json: item,
					}));

					returnData.push(...executionData);
				}
			}
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message } });
			} else {
				throw error;
			}
		}

		return [returnData];
	}
} 