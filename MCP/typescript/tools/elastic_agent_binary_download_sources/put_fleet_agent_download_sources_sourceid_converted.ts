/**
 * MCP Server function for Update an agent binary download source
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

function getPut_Api_Fleet_Agent_Download_Sources_Source_IdHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.sourceId !== undefined) {
        queryParams.push(`sourceId=${args.sourceId}`);
    }
    if (args.host !== undefined) {
        queryParams.push(`host=${args.host}`);
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
    if (args.is_default !== undefined) {
        queryParams.push(`is_default=${args.is_default}`);
    }
    if (args.secrets !== undefined) {
        queryParams.push(`secrets=${args.secrets}`);
    }
    if (args.ssl !== undefined) {
        queryParams.push(`ssl=${args.ssl}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/put_api_fleet_agent_download_sources_source_id${queryString}`;
            
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

function createPut_Api_Fleet_Agent_Download_Sources_Source_IdTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "put_api_fleet_agent_download_sources_source_id",
            description: "Update an agent binary download source",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        sourceId: { type: "string", required: true, description: "" },
        host: { type: "string", required: true, description: "" },
        id: { type: "string", required: false, description: "" },
        name: { type: "string", required: true, description: "" },
        proxy_id: { type: "string", required: false, description: "Input parameter: The ID of the proxy to use for this download source. See the proxies API for more information." },
        is_default: { type: "string", required: false, description: "" },
        secrets: { type: "string", required: false, description: "" },
        ssl: { type: "string", required: false, description: "" },
            }
        },
        handler: getPut_Api_Fleet_Agent_Download_Sources_Source_IdHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPut_Api_Fleet_Agent_Download_Sources_Source_IdHandler,
    createPut_Api_Fleet_Agent_Download_Sources_Source_IdTool
};