/**
 * MCP Server function for Preview significant events
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

function getPost_Api_Streams_Name_Significant_Events_PreviewHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.from !== undefined) {
        queryParams.push(`from=${args.from}`);
    }
    if (args.to !== undefined) {
        queryParams.push(`to=${args.to}`);
    }
    if (args.bucketSize !== undefined) {
        queryParams.push(`bucketSize=${args.bucketSize}`);
    }
    if (args.query !== undefined) {
        queryParams.push(`query=${args.query}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/post_api_streams_name_significant_events_preview${queryString}`;
            
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

function createPost_Api_Streams_Name_Significant_Events_PreviewTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "post_api_streams_name_significant_events_preview",
            description: "Preview significant events",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        name: { type: "string", required: true, description: "" },
        from: { type: "string", required: true, description: "" },
        to: { type: "string", required: true, description: "" },
        bucketSize: { type: "string", required: true, description: "" },
        query: { type: "string", required: true, description: "" },
            }
        },
        handler: getPost_Api_Streams_Name_Significant_Events_PreviewHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPost_Api_Streams_Name_Significant_Events_PreviewHandler,
    createPost_Api_Streams_Name_Significant_Events_PreviewTool
};