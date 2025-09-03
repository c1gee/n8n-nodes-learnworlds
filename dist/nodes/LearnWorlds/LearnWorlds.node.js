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
exports.LearnWorlds = void 0;
class LearnWorlds {
    constructor() {
        this.description = {
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
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            try {
                const credentials = yield this.getCredentials('learnWorldsApi');
                const { schoolDomain, clientId, clientSecret } = credentials;
                const learnWorldsDomain = process.env.LEARNWORLDS_DOMAIN || 'staging.b2bea.org';
                const tokenResponse = yield this.helpers.request({
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
                        const returnAll = this.getNodeParameter('returnAll', 0);
                        const limit = returnAll ? undefined : this.getNodeParameter('limit', 0);
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
                        responseData = yield this.helpers.request(options);
                        if (limit) {
                            responseData = responseData.slice(0, limit);
                        }
                        const executionData = responseData.map((item) => ({
                            json: item,
                        }));
                        returnData.push(...executionData);
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                }
                else {
                    throw error;
                }
            }
            return [returnData];
        });
    }
}
exports.LearnWorlds = LearnWorlds;
//# sourceMappingURL=LearnWorlds.node.js.map