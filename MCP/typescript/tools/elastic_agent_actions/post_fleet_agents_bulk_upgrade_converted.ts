/**
 * MCP Server function for Bulk upgrade agents
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

function getPost_Api_Fleet_Agents_Bulk_UpgradeHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.start_time !== undefined) {
        queryParams.push(`start_time=${args.start_time}`);
    }
    if (args.agents !== undefined) {
        queryParams.push(`agents=${args.agents}`);
    }
    if (args.rollout_duration_seconds !== undefined) {
        queryParams.push(`rollout_duration_seconds=${args.rollout_duration_seconds}`);
    }
    if (args.source_uri !== undefined) {
        queryParams.push(`source_uri=${args.source_uri}`);
    }
    if (args.version !== undefined) {
        queryParams.push(`version=${args.version}`);
    }
    if (args.batchSize !== undefined) {
        queryParams.push(`batchSize=${args.batchSize}`);
    }
    if (args.includeInactive !== undefined) {
        queryParams.push(`includeInactive=${args.includeInactive}`);
    }
    if (args.skipRateLimitCheck !== undefined) {
        queryParams.push(`skipRateLimitCheck=${args.skipRateLimitCheck}`);
    }
    if (args.force !== undefined) {
        queryParams.push(`force=${args.force}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/post_api_fleet_agents_bulk_upgrade${queryString}`;
            
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

function createPost_Api_Fleet_Agents_Bulk_UpgradeTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "post_api_fleet_agents_bulk_upgrade",
            description: "Bulk upgrade agents",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        start_time: { type: "string", required: false, description: "" },
        agents: { type: "string", required: true, description: "" },
        rollout_duration_seconds: { type: "string", required: false, description: "" },
        source_uri: { type: "string", required: false, description: "" },
        version: { type: "string", required: true, description: "" },
        batchSize: { type: "string", required: false, description: "" },
        includeInactive: { type: "string", required: false, description: "" },
        skipRateLimitCheck: { type: "string", required: false, description: "" },
        force: { type: "string", required: false, description: "" },
            }
        },
        handler: getPost_Api_Fleet_Agents_Bulk_UpgradeHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPost_Api_Fleet_Agents_Bulk_UpgradeHandler,
    createPost_Api_Fleet_Agents_Bulk_UpgradeTool
};