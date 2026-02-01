import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class FrappeLmsApi implements ICredentialType {
    name = 'frappeLmsApi';
    displayName = 'Frappe LMS API';
    documentationUrl = 'https://frappelms.com/docs';
    properties: INodeProperties[] = [
        {
            displayName: 'URL',
            name: 'url',
            type: 'string',
            default: '',
            placeholder: 'https://lms.yoursite.com',
            required: true,
        },
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
        },
        {
            displayName: 'API Secret',
            name: 'apiSecret',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=token {{$credentials.apiKey}}:{{$credentials.apiSecret}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: '={{$credentials.url}}',
            url: '/api/method/frappe.auth.get_logged_user',
            method: 'GET',
        },
    };
}
