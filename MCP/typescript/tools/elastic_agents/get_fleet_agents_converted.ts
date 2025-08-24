/**
 * MCP Server function for Get agents
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

function getGet_Api_Fleet_AgentsHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
    return async function(ctx: any, request: MCPRequest): Promise<MCPToolResult> {
        try {
            const args = request?.params?.arguments || {};
            if (typeof args !== 'object') {
                return new MCPToolResultImpl("Invalid arguments object", true);
            }
            
            const queryParams: string[] = [];
    if (args.page !== undefined) {
        queryParams.push(`page=${args.page}`);
    }
    if (args.perPage !== undefined) {
        queryParams.push(`perPage=${args.perPage}`);
    }
    if (args.kuery !== undefined) {
        queryParams.push(`kuery=${args.kuery}`);
    }
    if (args.sortField !== undefined) {
        queryParams.push(`sortField=${args.sortField}`);
    }
    if (args.sortOrder !== undefined) {
        queryParams.push(`sortOrder=${args.sortOrder}`);
    }
    if (args.searchAfter !== undefined) {
        queryParams.push(`searchAfter=${args.searchAfter}`);
    }
    if (args.pitId !== undefined) {
        queryParams.push(`pitId=${args.pitId}`);
    }
    if (args.pitKeepAlive !== undefined) {
        queryParams.push(`pitKeepAlive=${args.pitKeepAlive}`);
    }
    if (args.showAgentless !== undefined) {
        queryParams.push(`showAgentless=${args.showAgentless}`);
    }
    if (args.showInactive !== undefined) {
        queryParams.push(`showInactive=${args.showInactive}`);
    }
    if (args.withMetrics !== undefined) {
        queryParams.push(`withMetrics=${args.withMetrics}`);
    }
    if (args.showUpgradeable !== undefined) {
        queryParams.push(`showUpgradeable=${args.showUpgradeable}`);
    }
    if (args.getStatusSummary !== undefined) {
        queryParams.push(`getStatusSummary=${args.getStatusSummary}`);
    }
    if (args.openPit !== undefined) {
        queryParams.push(`openPit=${args.openPit}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/get_api_fleet_agents${queryString}`;
            
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

function createGet_Api_Fleet_AgentsTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "get_api_fleet_agents",
            description: "Get agents",
            parameters: {
        page: { type: "string", required: false, description: "" },
        perPage: { type: "string", required: false, description: "" },
        kuery: { type: "string", required: false, description: "" },
        sortField: { type: "string", required: false, description: "" },
        sortOrder: { type: "string", required: false, description: "" },
        searchAfter: { type: "string", required: false, description: "" },
        pitId: { type: "string", required: false, description: "" },
        pitKeepAlive: { type: "string", required: false, description: "" },
        showAgentless: { type: "string", required: false, description: "" },
        showInactive: { type: "string", required: false, description: "" },
        withMetrics: { type: "string", required: false, description: "" },
        showUpgradeable: { type: "string", required: false, description: "" },
        getStatusSummary: { type: "string", required: false, description: "" },
        openPit: { type: "string", required: false, description: "" },
            }
        },
        handler: getGet_Api_Fleet_AgentsHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getGet_Api_Fleet_AgentsHandler,
    createGet_Api_Fleet_AgentsTool
};