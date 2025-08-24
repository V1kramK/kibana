/**
 * MCP Server function for Bulk unenroll agents
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

function getPost_Api_Fleet_Agents_Bulk_UnenrollHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.agents !== undefined) {
        queryParams.push(`agents=${args.agents}`);
    }
    if (args.batchSize !== undefined) {
        queryParams.push(`batchSize=${args.batchSize}`);
    }
    if (args.force !== undefined) {
        queryParams.push(`force=${args.force}`);
    }
    if (args.includeInactive !== undefined) {
        queryParams.push(`includeInactive=${args.includeInactive}`);
    }
    if (args.revoke !== undefined) {
        queryParams.push(`revoke=${args.revoke}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/post_api_fleet_agents_bulk_unenroll${queryString}`;
            
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

function createPost_Api_Fleet_Agents_Bulk_UnenrollTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "post_api_fleet_agents_bulk_unenroll",
            description: "Bulk unenroll agents",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        agents: { type: "string", required: true, description: "" },
        batchSize: { type: "string", required: false, description: "" },
        force: { type: "string", required: false, description: "Input parameter: Unenrolls hosted agents too" },
        includeInactive: { type: "string", required: false, description: "Input parameter: When passing agents by KQL query, unenrolls inactive agents too" },
        revoke: { type: "string", required: false, description: "Input parameter: Revokes API keys of agents" },
            }
        },
        handler: getPost_Api_Fleet_Agents_Bulk_UnenrollHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPost_Api_Fleet_Agents_Bulk_UnenrollHandler,
    createPost_Api_Fleet_Agents_Bulk_UnenrollTool
};