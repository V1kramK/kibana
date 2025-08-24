/**
 * MCP Server function for Get a full agent policy
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

function getGet_Api_Fleet_Agent_Policies_Agent_Policy_Id_FullHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
    return async function(ctx: any, request: MCPRequest): Promise<MCPToolResult> {
        try {
            const args = request?.params?.arguments || {};
            if (typeof args !== 'object') {
                return new MCPToolResultImpl("Invalid arguments object", true);
            }
            
            const queryParams: string[] = [];
    if (args.agentPolicyId !== undefined) {
        queryParams.push(`agentPolicyId=${args.agentPolicyId}`);
    }
    if (args.download !== undefined) {
        queryParams.push(`download=${args.download}`);
    }
    if (args.standalone !== undefined) {
        queryParams.push(`standalone=${args.standalone}`);
    }
    if (args.kubernetes !== undefined) {
        queryParams.push(`kubernetes=${args.kubernetes}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/get_api_fleet_agent_policies_agent_policy_id_full${queryString}`;
            
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

function createGet_Api_Fleet_Agent_Policies_Agent_Policy_Id_FullTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "get_api_fleet_agent_policies_agent_policy_id_full",
            description: "Get a full agent policy",
            parameters: {
        agentPolicyId: { type: "string", required: true, description: "" },
        download: { type: "string", required: false, description: "" },
        standalone: { type: "string", required: false, description: "" },
        kubernetes: { type: "string", required: false, description: "" },
            }
        },
        handler: getGet_Api_Fleet_Agent_Policies_Agent_Policy_Id_FullHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getGet_Api_Fleet_Agent_Policies_Agent_Policy_Id_FullHandler,
    createGet_Api_Fleet_Agent_Policies_Agent_Policy_Id_FullTool
};