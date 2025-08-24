/**
 * MCP Server function for Generate significant events
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

function getGet_Api_Streams_Name_Significant_Events_GenerateHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
    return async function(ctx: any, request: MCPRequest): Promise<MCPToolResult> {
        try {
            const args = request?.params?.arguments || {};
            if (typeof args !== 'object') {
                return new MCPToolResultImpl("Invalid arguments object", true);
            }
            
            const queryParams: string[] = [];
    if (args.name !== undefined) {
        queryParams.push(`name=${args.name}`);
    }
    if (args.connectorId !== undefined) {
        queryParams.push(`connectorId=${args.connectorId}`);
    }
    if (args.currentDate !== undefined) {
        queryParams.push(`currentDate=${args.currentDate}`);
    }
    if (args.shortLookback !== undefined) {
        queryParams.push(`shortLookback=${args.shortLookback}`);
    }
    if (args.longLookback !== undefined) {
        queryParams.push(`longLookback=${args.longLookback}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/get_api_streams_name_significant_events_generate${queryString}`;
            
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

function createGet_Api_Streams_Name_Significant_Events_GenerateTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "get_api_streams_name_significant_events_generate",
            description: "Generate significant events",
            parameters: {
        name: { type: "string", required: true, description: "" },
        connectorId: { type: "string", required: true, description: "" },
        currentDate: { type: "string", required: false, description: "" },
        shortLookback: { type: "string", required: false, description: "" },
        longLookback: { type: "string", required: false, description: "" },
            }
        },
        handler: getGet_Api_Streams_Name_Significant_Events_GenerateHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getGet_Api_Streams_Name_Significant_Events_GenerateHandler,
    createGet_Api_Streams_Name_Significant_Events_GenerateTool
};