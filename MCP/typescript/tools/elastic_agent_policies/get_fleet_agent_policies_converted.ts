/**
 * MCP Server function for Get agent policies
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

function getGet_Api_Fleet_Agent_PoliciesHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.sortField !== undefined) {
        queryParams.push(`sortField=${args.sortField}`);
    }
    if (args.sortOrder !== undefined) {
        queryParams.push(`sortOrder=${args.sortOrder}`);
    }
    if (args.kuery !== undefined) {
        queryParams.push(`kuery=${args.kuery}`);
    }
    if (args.format !== undefined) {
        queryParams.push(`format=${args.format}`);
    }
    if (args.showUpgradeable !== undefined) {
        queryParams.push(`showUpgradeable=${args.showUpgradeable}`);
    }
    if (args.noAgentCount !== undefined) {
        queryParams.push(`noAgentCount=${args.noAgentCount}`);
    }
    if (args.withAgentCount !== undefined) {
        queryParams.push(`withAgentCount=${args.withAgentCount}`);
    }
    if (args.full !== undefined) {
        queryParams.push(`full=${args.full}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/get_api_fleet_agent_policies${queryString}`;
            
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

function createGet_Api_Fleet_Agent_PoliciesTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "get_api_fleet_agent_policies",
            description: "Get agent policies",
            parameters: {
        page: { type: "string", required: false, description: "" },
        perPage: { type: "string", required: false, description: "" },
        sortField: { type: "string", required: false, description: "" },
        sortOrder: { type: "string", required: false, description: "" },
        kuery: { type: "string", required: false, description: "" },
        format: { type: "string", required: false, description: "" },
        showUpgradeable: { type: "string", required: false, description: "" },
        noAgentCount: { type: "string", required: false, description: "use withAgentCount instead" },
        withAgentCount: { type: "string", required: false, description: "get policies with agent count" },
        full: { type: "string", required: false, description: "get full policies with package policies populated" },
            }
        },
        handler: getGet_Api_Fleet_Agent_PoliciesHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getGet_Api_Fleet_Agent_PoliciesHandler,
    createGet_Api_Fleet_Agent_PoliciesTool
};