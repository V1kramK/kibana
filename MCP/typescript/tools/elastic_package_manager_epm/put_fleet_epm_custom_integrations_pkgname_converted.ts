/**
 * MCP Server function for Update a custom integration
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

function getPut_Api_Fleet_Epm_Custom_Integrations_Pkg_NameHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.pkgName !== undefined) {
        queryParams.push(`pkgName=${args.pkgName}`);
    }
    if (args.readMeData !== undefined) {
        queryParams.push(`readMeData=${args.readMeData}`);
    }
    if (args.categories !== undefined) {
        queryParams.push(`categories=${args.categories}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/put_api_fleet_epm_custom_integrations_pkg_name${queryString}`;
            
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

function createPut_Api_Fleet_Epm_Custom_Integrations_Pkg_NameTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "put_api_fleet_epm_custom_integrations_pkg_name",
            description: "Update a custom integration",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        pkgName: { type: "string", required: true, description: "" },
        readMeData: { type: "string", required: true, description: "" },
        categories: { type: "string", required: false, description: "" },
            }
        },
        handler: getPut_Api_Fleet_Epm_Custom_Integrations_Pkg_NameHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPut_Api_Fleet_Epm_Custom_Integrations_Pkg_NameHandler,
    createPut_Api_Fleet_Epm_Custom_Integrations_Pkg_NameTool
};