/**
 * MCP Server function for Create a Fleet Server host
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

function getPost_Api_Fleet_Fleet_Server_HostsHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.id !== undefined) {
        queryParams.push(`id=${args.id}`);
    }
    if (args.name !== undefined) {
        queryParams.push(`name=${args.name}`);
    }
    if (args.proxy_id !== undefined) {
        queryParams.push(`proxy_id=${args.proxy_id}`);
    }
    if (args.is_internal !== undefined) {
        queryParams.push(`is_internal=${args.is_internal}`);
    }
    if (args.is_default !== undefined) {
        queryParams.push(`is_default=${args.is_default}`);
    }
    if (args.is_preconfigured !== undefined) {
        queryParams.push(`is_preconfigured=${args.is_preconfigured}`);
    }
    if (args.secrets !== undefined) {
        queryParams.push(`secrets=${args.secrets}`);
    }
    if (args.ssl !== undefined) {
        queryParams.push(`ssl=${args.ssl}`);
    }
    if (args.host_urls !== undefined) {
        queryParams.push(`host_urls=${args.host_urls}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/post_api_fleet_fleet_server_hosts${queryString}`;
            
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

function createPost_Api_Fleet_Fleet_Server_HostsTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "post_api_fleet_fleet_server_hosts",
            description: "Create a Fleet Server host",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        id: { type: "string", required: false, description: "" },
        name: { type: "string", required: true, description: "" },
        proxy_id: { type: "string", required: false, description: "" },
        is_internal: { type: "string", required: false, description: "" },
        is_default: { type: "string", required: false, description: "" },
        is_preconfigured: { type: "string", required: false, description: "" },
        secrets: { type: "string", required: false, description: "" },
        ssl: { type: "string", required: false, description: "" },
        host_urls: { type: "string", required: true, description: "" },
            }
        },
        handler: getPost_Api_Fleet_Fleet_Server_HostsHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPost_Api_Fleet_Fleet_Server_HostsHandler,
    createPost_Api_Fleet_Fleet_Server_HostsTool
};