/**
 * MCP Server function for Create or update a role
 */

import axios, { AxiosResponse } from 'axios';

interface APIConfig {
    baseUrl: string;
    apiKey: string;
}

interface MCPRequest {
    params?: {
        arguments?: Record<string, any>;
    };
}

interface MCPToolResult {
    content: string;
    isError: boolean;
}

interface ToolDefinition {
    name: string;
    description: string;
    parameters: Record<string, {
        type: string;
        required: boolean;
        description: string;
    }>;
}

interface Tool {
    definition: ToolDefinition;
    handler: (ctx: any, request: MCPRequest) => Promise<MCPToolResult>;
}

class MCPToolResultImpl implements MCPToolResult {
    constructor(
        public content: string,
        public isError: boolean = false
    ) {}
}

function getPut_Api_Security_Role_NameHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
    return async function(ctx: any, request: MCPRequest): Promise<MCPToolResult> {
        try {
            const args = request?.params?.arguments || {};
            if (typeof args !== 'object') {
                return new MCPToolResultImpl("Invalid arguments object", true);
            }
            
            const queryParams: string[] = [];
    if (args.kbn-xsrf !== undefined) {
        queryParams.push(`kbn-xsrf=${args.kbn-xsrf}`);
    }
    if (args.name !== undefined) {
        queryParams.push(`name=${args.name}`);
    }
    if (args.description !== undefined) {
        queryParams.push(`description=${args.description}`);
    }
    if (args.createOnly !== undefined) {
        queryParams.push(`createOnly=${args.createOnly}`);
    }
    if (args.elasticsearch !== undefined) {
        queryParams.push(`elasticsearch=${args.elasticsearch}`);
    }
    if (args.metadata !== undefined) {
        queryParams.push(`metadata=${args.metadata}`);
    }
    if (args.kibana !== undefined) {
        queryParams.push(`kibana=${args.kibana}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/put_api_security_role_name${queryString}`;
            
            const headers = {
                'Authorization': `Bearer ${config.apiKey}`,
                'Accept': 'application/json'
            };
            
            const response: AxiosResponse = await axios.get(url, { headers });
            
            if (response.status >= 400) {
                return new MCPToolResultImpl(`API error: ${response.data}`, true);
            }
            
            const prettyJSON = JSON.stringify(response.data, null, 2);
            return new MCPToolResultImpl(prettyJSON);
            
        } catch (error: any) {
            if (error.response) {
                return new MCPToolResultImpl(`Request failed: ${error.response.data}`, true);
            }
            return new MCPToolResultImpl(`Unexpected error: ${error.message}`, true);
        }
    };
}

function createPut_Api_Security_Role_NameTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "put_api_security_role_name",
            description: "Create or update a role",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        name: { type: "string", required: true, description: "The role name." },
        description: { type: "string", required: false, description: "Input parameter: A description for the role." },
        createOnly: { type: "string", required: false, description: "When true, a role is not overwritten if it already exists." },
        elasticsearch: { type: "string", required: true, description: "" },
        metadata: { type: "string", required: false, description: "" },
        kibana: { type: "string", required: false, description: "" },
            }
        },
        handler: getPut_Api_Security_Role_NameHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPut_Api_Security_Role_NameHandler,
    createPut_Api_Security_Role_NameTool
};