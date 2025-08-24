/**
 * MCP Server function for Get metadata for latest uninstall tokens
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

function getGet_Api_Fleet_Uninstall_TokensHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
    return async function(ctx: any, request: MCPRequest): Promise<MCPToolResult> {
        try {
            const args = request?.params?.arguments || {};
            if (typeof args !== 'object') {
                return new MCPToolResultImpl("Invalid arguments object", true);
            }
            
            const queryParams: string[] = [];
    if (args.policyId !== undefined) {
        queryParams.push(`policyId=${args.policyId}`);
    }
    if (args.search !== undefined) {
        queryParams.push(`search=${args.search}`);
    }
    if (args.perPage !== undefined) {
        queryParams.push(`perPage=${args.perPage}`);
    }
    if (args.page !== undefined) {
        queryParams.push(`page=${args.page}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/get_api_fleet_uninstall_tokens${queryString}`;
            
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

function createGet_Api_Fleet_Uninstall_TokensTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "get_api_fleet_uninstall_tokens",
            description: "Get metadata for latest uninstall tokens",
            parameters: {
        policyId: { type: "string", required: false, description: "Partial match filtering for policy IDs" },
        search: { type: "string", required: false, description: "" },
        perPage: { type: "string", required: false, description: "The number of items to return" },
        page: { type: "string", required: false, description: "" },
            }
        },
        handler: getGet_Api_Fleet_Uninstall_TokensHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getGet_Api_Fleet_Uninstall_TokensHandler,
    createGet_Api_Fleet_Uninstall_TokensTool
};