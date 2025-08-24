/**
 * MCP Server function for Upgrade an agent
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

function getPost_Api_Fleet_Agents_Agent_Id_UpgradeHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.agentId !== undefined) {
        queryParams.push(`agentId=${args.agentId}`);
    }
    if (args.source_uri !== undefined) {
        queryParams.push(`source_uri=${args.source_uri}`);
    }
    if (args.version !== undefined) {
        queryParams.push(`version=${args.version}`);
    }
    if (args.force !== undefined) {
        queryParams.push(`force=${args.force}`);
    }
    if (args.skipRateLimitCheck !== undefined) {
        queryParams.push(`skipRateLimitCheck=${args.skipRateLimitCheck}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/post_api_fleet_agents_agent_id_upgrade${queryString}`;
            
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

function createPost_Api_Fleet_Agents_Agent_Id_UpgradeTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "post_api_fleet_agents_agent_id_upgrade",
            description: "Upgrade an agent",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        agentId: { type: "string", required: true, description: "" },
        source_uri: { type: "string", required: false, description: "" },
        version: { type: "string", required: true, description: "" },
        force: { type: "string", required: false, description: "" },
        skipRateLimitCheck: { type: "string", required: false, description: "" },
            }
        },
        handler: getPost_Api_Fleet_Agents_Agent_Id_UpgradeHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPost_Api_Fleet_Agents_Agent_Id_UpgradeHandler,
    createPost_Api_Fleet_Agents_Agent_Id_UpgradeTool
};