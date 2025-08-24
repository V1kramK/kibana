/**
 * MCP Server function for Mute an alert
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

function getPost_Api_Alerting_Rule_Rule_Id_Alert_Alert_Id_MuteHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.rule_id !== undefined) {
        queryParams.push(`rule_id=${args.rule_id}`);
    }
    if (args.alert_id !== undefined) {
        queryParams.push(`alert_id=${args.alert_id}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/post_api_alerting_rule_rule_id_alert_alert_id_mute${queryString}`;
            
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

function createPost_Api_Alerting_Rule_Rule_Id_Alert_Alert_Id_MuteTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "post_api_alerting_rule_rule_id_alert_alert_id_mute",
            description: "Mute an alert",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        rule_id: { type: "string", required: true, description: "The identifier for the rule." },
        alert_id: { type: "string", required: true, description: "The identifier for the alert." },
            }
        },
        handler: getPost_Api_Alerting_Rule_Rule_Id_Alert_Alert_Id_MuteHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPost_Api_Alerting_Rule_Rule_Id_Alert_Alert_Id_MuteHandler,
    createPost_Api_Alerting_Rule_Rule_Id_Alert_Alert_Id_MuteTool
};