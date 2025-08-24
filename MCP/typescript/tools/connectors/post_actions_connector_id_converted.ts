/**
 * MCP Server function for Create a connector
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

function getPost_Api_Actions_Connector_IdHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.connector_type_id !== undefined) {
        queryParams.push(`connector_type_id=${args.connector_type_id}`);
    }
    if (args.name !== undefined) {
        queryParams.push(`name=${args.name}`);
    }
    if (args.config !== undefined) {
        queryParams.push(`config=${args.config}`);
    }
    if (args.secrets !== undefined) {
        queryParams.push(`secrets=${args.secrets}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/post_api_actions_connector_id${queryString}`;
            
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

function createPost_Api_Actions_Connector_IdTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "post_api_actions_connector_id",
            description: "Create a connector",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        id: { type: "string", required: false, description: "An identifier for the connector." },
        connector_type_id: { type: "string", required: true, description: "Input parameter: The type of connector." },
        name: { type: "string", required: true, description: "Input parameter: The display name for the connector." },
        config: { type: "string", required: false, description: "" },
        secrets: { type: "string", required: false, description: "" },
            }
        },
        handler: getPost_Api_Actions_Connector_IdHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPost_Api_Actions_Connector_IdHandler,
    createPost_Api_Actions_Connector_IdTool
};