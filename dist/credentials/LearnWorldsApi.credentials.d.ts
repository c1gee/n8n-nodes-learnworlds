import { ICredentialType, NodePropertyTypes, ICredentialDataDecryptedObject, IHttpRequestOptions, ICredentialTestRequest } from 'n8n-workflow';
export declare class LearnWorldsApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    extends: string[];
    icon: string;
    properties: ({
        displayName: string;
        name: string;
        type: NodePropertyTypes;
        default: string;
        required: boolean;
        description: string;
        typeOptions?: undefined;
        placeholder?: undefined;
    } | {
        displayName: string;
        name: string;
        type: NodePropertyTypes;
        typeOptions: {
            password: boolean;
        };
        default: string;
        required: boolean;
        description: string;
        placeholder?: undefined;
    } | {
        displayName: string;
        name: string;
        type: NodePropertyTypes;
        default: string;
        placeholder: string;
        required: boolean;
        description: string;
        typeOptions?: undefined;
    })[];
    authenticate(credentials: ICredentialDataDecryptedObject, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
    test: ICredentialTestRequest;
}
