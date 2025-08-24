/**
 * MCP Server function for Update a maintenance window.
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

function getPatch_Api_Maintenance_Window_IdHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.title !== undefined) {
        queryParams.push(`title=${args.title}`);
    }
    if (args.enabled !== undefined) {
        queryParams.push(`enabled=${args.enabled}`);
    }
    if (args.schedule !== undefined) {
        queryParams.push(`schedule=${args.schedule}`);
    }
    if (args.scope !== undefined) {
        queryParams.push(`scope=${args.scope}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/patch_api_maintenance_window_id${queryString}`;
            
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

function createPatch_Api_Maintenance_Window_IdTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "patch_api_maintenance_window_id",
            description: "Update a maintenance window.",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        id: { type: "string", required: true, description: "" },
        title: { type: "string", required: false, description: "Input parameter: The name of the maintenance window. While this name does not have to be unique, a distinctive name can help you identify a specific maintenance window." },
        enabled: { type: "string", required: false, description: "Input parameter: Whether the current maintenance window is enabled. Disabled maintenance windows do not suppress notifications." },
        schedule: { type: "string", required: false, description: "" },
        scope: { type: "string", required: false, description: "" },
            }
        },
        handler: getPatch_Api_Maintenance_Window_IdHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPatch_Api_Maintenance_Window_IdHandler,
    createPatch_Api_Maintenance_Window_IdTool
};