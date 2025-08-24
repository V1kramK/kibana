/**
 * MCP Server function for Bulk get agent policies
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

function getPost_Api_Fleet_Agent_Policies_Bulk_GetHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.format !== undefined) {
        queryParams.push(`format=${args.format}`);
    }
    if (args.full !== undefined) {
        queryParams.push(`full=${args.full}`);
    }
    if (args.ignoreMissing !== undefined) {
        queryParams.push(`ignoreMissing=${args.ignoreMissing}`);
    }
    if (args.ids !== undefined) {
        queryParams.push(`ids=${args.ids}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/post_api_fleet_agent_policies_bulk_get${queryString}`;
            
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

function createPost_Api_Fleet_Agent_Policies_Bulk_GetTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "post_api_fleet_agent_policies_bulk_get",
            description: "Bulk get agent policies",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        format: { type: "string", required: false, description: "" },
        full: { type: "string", required: false, description: "Input parameter: get full policies with package policies populated" },
        ignoreMissing: { type: "string", required: false, description: "" },
        ids: { type: "string", required: true, description: "Input parameter: list of package policy ids" },
            }
        },
        handler: getPost_Api_Fleet_Agent_Policies_Bulk_GetHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPost_Api_Fleet_Agent_Policies_Bulk_GetHandler,
    createPost_Api_Fleet_Agent_Policies_Bulk_GetTool
};