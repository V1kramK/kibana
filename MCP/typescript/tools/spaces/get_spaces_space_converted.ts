/**
 * MCP Server function for Get all spaces
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

function getGet_Api_Spaces_SpaceHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
    return async function(ctx: any, request: MCPRequest): Promise<MCPToolResult> {
        try {
            const args = request?.params?.arguments || {};
            if (typeof args !== 'object') {
                return new MCPToolResultImpl("Invalid arguments object", true);
            }
            
            const queryParams: string[] = [];
    if (args.purpose !== undefined) {
        queryParams.push(`purpose=${args.purpose}`);
    }
    if (args.include_authorized_purposes !== undefined) {
        queryParams.push(`include_authorized_purposes=${args.include_authorized_purposes}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/get_api_spaces_space${queryString}`;
            
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

function createGet_Api_Spaces_SpaceTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "get_api_spaces_space",
            description: "Get all spaces",
            parameters: {
        purpose: { type: "string", required: false, description: "Specifies which authorization checks are applied to the API call. The default value is `any`." },
        include_authorized_purposes: { type: "string", required: true, description: "When enabled, the API returns any spaces that the user is authorized to access in any capacity and each space will contain the purposes for which the user is authorized. This can be useful to determine which spaces a user can read but not take a specific action in. If the security plugin is not enabled, this parameter has no effect, since no authorization checks take place. This parameter cannot be used in with the `purpose` parameter." },
            }
        },
        handler: getGet_Api_Spaces_SpaceHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getGet_Api_Spaces_SpaceHandler,
    createGet_Api_Spaces_SpaceTool
};