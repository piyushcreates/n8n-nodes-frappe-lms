import {
    IExecuteFunctions,
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';

export class FrappeLms implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Frappe LMS',
        name: 'frappeLms',
        icon: 'file:frappeLms.png',
        group: ['transform'],
        version: 1,
        description: 'Consume Frappe LMS API',
        defaults: {
            name: 'Frappe LMS',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'frappeLmsApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                options: [
                    { name: 'Course', value: 'course' },
                    { name: 'Student', value: 'student' },
                    { name: 'Enrollment', value: 'enrollment' },
                    { name: 'Communication', value: 'communication' },
                ],
                default: 'course',
                noDataExpression: true,
                required: true,
                description: 'The resource to operate on',
            },

            // --- Course Operations ---
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                displayOptions: { show: { resource: ['course'] } },
                options: [
                    { name: 'Create', value: 'create', description: 'Create a course' },
                    { name: 'Get', value: 'get', description: 'Get a course' },
                    { name: 'Get All', value: 'getAll', description: 'Get all courses' },
                ],
                default: 'create',
                noDataExpression: true,
            },
            {
                displayName: 'Title',
                name: 'title',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['course'], operation: ['create'] } },
                description: 'The title of the course',
            },
            {
                displayName: 'Short Introduction',
                name: 'shortIntroduction',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['course'], operation: ['create'] } },
                description: 'Brief introduction to the course',
            },
            {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                typeOptions: { rows: 4 },
                default: '',
                required: true,
                displayOptions: { show: { resource: ['course'], operation: ['create'] } },
                description: 'Full description of the course',
            },
            {
                displayName: 'Instructors',
                name: 'instructors',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['course'], operation: ['create'] } },
                description: 'Comma-separated list of instructor emails (e.g., instructor1@example.com,instructor2@example.com)',
            },
            {
                displayName: 'Course Name (ID)',
                name: 'courseId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['course'], operation: ['get'] } },
                description: 'The name/ID of the course',
            },

            // --- Student Operations ---
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                displayOptions: { show: { resource: ['student'] } },
                options: [
                    { name: 'Register', value: 'create', description: 'Register a new student' },
                    { name: 'Get Details', value: 'get', description: 'Get student details' },
                    { name: 'Update Profile', value: 'update', description: 'Update student information' },
                ],
                default: 'create',
                noDataExpression: true,
            },
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['student'] } },
                description: 'Email of the student',
            },
            {
                displayName: 'First Name',
                name: 'firstName',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['student'], operation: ['create', 'update'] } },
                description: 'First name of the student',
            },
            {
                displayName: 'Last Name',
                name: 'lastName',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['student'], operation: ['create', 'update'] } },
                description: 'Last name of the student',
            },

            // --- Enrollment Operations ---
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                displayOptions: { show: { resource: ['enrollment'] } },
                options: [
                    { name: 'Enroll in Course', value: 'create', description: 'Enroll a student in a course' },
                    { name: 'Get Enrollments', value: 'getByMember', description: 'Get all enrollments for a student' },
                ],
                default: 'create',
                noDataExpression: true,
            },
            {
                displayName: 'Member (Email)',
                name: 'memberId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['enrollment'], operation: ['create', 'getByMember'] } },
                description: 'Email of the student (Member)',
            },
            {
                displayName: 'Course Name (ID)',
                name: 'courseId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['enrollment'], operation: ['create'] } },
                description: 'ID of the course',
            },
            {
                displayName: 'Batch Name (ID)',
                name: 'batchId',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['enrollment'], operation: ['create'] } },
                description: 'ID of the batch (Optional)',
            },

            // --- Communication Operations ---
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                displayOptions: { show: { resource: ['communication'] } },
                options: [
                    { name: 'Send Announcement', value: 'create', description: 'Send an announcement or message' },
                ],
                default: 'create',
                noDataExpression: true,
            },
            {
                displayName: 'Subject',
                name: 'subject',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['communication'], operation: ['create'] } },
                description: 'Subject of the message',
            },
            {
                displayName: 'Content',
                name: 'content',
                type: 'string',
                default: '',
                typeOptions: { rows: 4 },
                required: true,
                displayOptions: { show: { resource: ['communication'], operation: ['create'] } },
                description: 'Content of the message (HTML supported)',
            },
            {
                displayName: 'Reference Doctype',
                name: 'referenceDoctype',
                type: 'options',
                options: [
                    { name: 'LMS Batch', value: 'LMS Batch' },
                    { name: 'LMS Course', value: 'LMS Course' },
                    { name: 'User', value: 'User' },
                ],
                default: 'LMS Batch',
                required: true,
                displayOptions: { show: { resource: ['communication'], operation: ['create'] } },
                description: 'What is this linked to?',
            },
            {
                displayName: 'Reference Name (ID)',
                name: 'referenceName',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['communication'], operation: ['create'] } },
                description: 'ID of the Batch/Course/User',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: IDataObject[] = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        for (let i = 0; i < items.length; i++) {
            try {
                const credentials = await this.getCredentials('frappeLmsApi');
                const baseOptions: any = {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `token ${credentials.apiKey}:${credentials.apiSecret}`
                    },
                    json: true,
                };
                let responseData;

                if (resource === 'course') {
                    if (operation === 'create') {
                        const title = this.getNodeParameter('title', i) as string;
                        const shortIntroduction = this.getNodeParameter('shortIntroduction', i) as string;
                        const description = this.getNodeParameter('description', i) as string;
                        const instructorsStr = this.getNodeParameter('instructors', i) as string;

                        // Convert comma-separated instructors to array
                        const instructors = instructorsStr.split(',').map(email => ({ email: email.trim() }));

                        baseOptions.method = 'POST';
                        baseOptions.uri = `${credentials.url}/api/resource/LMS Course`;
                        baseOptions.body = {
                            title,
                            short_introduction: shortIntroduction,
                            description,
                            instructors
                        };

                        responseData = await this.helpers.request(baseOptions);
                        returnData.push(responseData.data);

                    } else if (operation === 'getAll') {
                        baseOptions.method = 'GET';
                        baseOptions.uri = `${credentials.url}/api/resource/LMS Course`;

                        responseData = await this.helpers.request(baseOptions);
                        if (responseData.data) returnData.push.apply(returnData, responseData.data);

                    } else if (operation === 'get') {
                        const courseId = this.getNodeParameter('courseId', i) as string;
                        baseOptions.method = 'GET';
                        baseOptions.uri = `${credentials.url}/api/resource/LMS Course/${courseId}`;

                        responseData = await this.helpers.request(baseOptions);
                        returnData.push(responseData.data);
                    }
                }
                else if (resource === 'student') {
                    const email = this.getNodeParameter('email', i) as string;
                    if (operation === 'create') {
                        const firstName = this.getNodeParameter('firstName', i) as string;
                        const lastName = this.getNodeParameter('lastName', i) as string;
                        baseOptions.method = 'POST';
                        baseOptions.uri = `${credentials.url}/api/resource/User`;
                        baseOptions.body = {
                            email,
                            first_name: firstName,
                            last_name: lastName,
                            enabled: 1,
                            send_welcome_email: 0
                        };
                        responseData = await this.helpers.request(baseOptions);
                        returnData.push(responseData.data);

                    } else if (operation === 'get') {
                        baseOptions.method = 'GET';
                        baseOptions.uri = `${credentials.url}/api/resource/User/${email}`;
                        responseData = await this.helpers.request(baseOptions);
                        returnData.push(responseData.data);

                    } else if (operation === 'update') {
                        const firstName = this.getNodeParameter('firstName', i) as string;
                        const lastName = this.getNodeParameter('lastName', i) as string;
                        baseOptions.method = 'PUT';
                        baseOptions.uri = `${credentials.url}/api/resource/User/${email}`;
                        baseOptions.body = {};
                        if (firstName) baseOptions.body.first_name = firstName;
                        if (lastName) baseOptions.body.last_name = lastName;

                        responseData = await this.helpers.request(baseOptions);
                        returnData.push(responseData.data);
                    }
                }
                else if (resource === 'enrollment') {
                    if (operation === 'create') {
                        const member = this.getNodeParameter('memberId', i) as string;
                        const course = this.getNodeParameter('courseId', i) as string;
                        const batch = this.getNodeParameter('batchId', i) as string;
                        baseOptions.method = 'POST';
                        baseOptions.uri = `${credentials.url}/api/resource/LMS Enrollment`;
                        baseOptions.body = { member, course };
                        if (batch) {
                            baseOptions.body.batch = batch;
                            // Note: Frappe might require LMS Batch Enrollment doc for batches, but let's try standard enrollment first
                        }
                        responseData = await this.helpers.request(baseOptions);
                        returnData.push(responseData.data);

                    } else if (operation === 'getByMember') {
                        const member = this.getNodeParameter('memberId', i) as string;
                        baseOptions.method = 'GET';
                        baseOptions.uri = `${credentials.url}/api/resource/LMS Enrollment`;
                        baseOptions.qs = { filters: JSON.stringify([['member', '=', member]]) };

                        responseData = await this.helpers.request(baseOptions);
                        if (responseData.data) returnData.push.apply(returnData, responseData.data);
                    }
                }
                else if (resource === 'communication') {
                    if (operation === 'create') {
                        const subject = this.getNodeParameter('subject', i) as string;
                        const content = this.getNodeParameter('content', i) as string;
                        const refDoctype = this.getNodeParameter('referenceDoctype', i) as string;
                        const refName = this.getNodeParameter('referenceName', i) as string;

                        baseOptions.method = 'POST';
                        baseOptions.uri = `${credentials.url}/api/resource/Communication`;
                        baseOptions.body = {
                            subject,
                            content,
                            reference_doctype: refDoctype,
                            reference_name: refName,
                            communication_type: 'Communication', // Important
                            sent_or_received: 'Sent'
                        };
                        responseData = await this.helpers.request(baseOptions);
                        returnData.push(responseData.data);
                    }
                }

            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: (error as Error).message });
                    continue;
                }
                throw new NodeOperationError(this.getNode(), error as Error);
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}
