/**
 * MCP Server function for Update a rule
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

function getPut_Api_Alerting_Rule_IdHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.throttle !== undefined) {
        queryParams.push(`throttle=${args.throttle}`);
    }
    if (args.notify_when !== undefined) {
        queryParams.push(`notify_when=${args.notify_when}`);
    }
    if (args.name !== undefined) {
        queryParams.push(`name=${args.name}`);
    }
    if (args.flapping !== undefined) {
        queryParams.push(`flapping=${args.flapping}`);
    }
    if (args.artifacts !== undefined) {
        queryParams.push(`artifacts=${args.artifacts}`);
    }
    if (args.schedule !== undefined) {
        queryParams.push(`schedule=${args.schedule}`);
    }
    if (args.alert_delay !== undefined) {
        queryParams.push(`alert_delay=${args.alert_delay}`);
    }
    if (args.params !== undefined) {
        queryParams.push(`params=${args.params}`);
    }
    if (args.actions !== undefined) {
        queryParams.push(`actions=${args.actions}`);
    }
    if (args.tags !== undefined) {
        queryParams.push(`tags=${args.tags}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/put_api_alerting_rule_id${queryString}`;
            
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

function createPut_Api_Alerting_Rule_IdTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "put_api_alerting_rule_id",
            description: "Update a rule",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        id: { type: "string", required: true, description: "The identifier for the rule." },
        throttle: { type: "string", required: false, description: "Input parameter: Use the `throttle` property in the action `frequency` object instead. The throttle interval, which defines how often an alert generates repeated actions. NOTE: You cannot specify the throttle interval at both the rule and action level. If you set it at the rule level then update the rule in Kibana, it is automatically changed to use action-specific values." },
        notify_when: { type: "string", required: false, description: "Input parameter: Indicates how often alerts generate actions. Valid values include: `onActionGroupChange`: Actions run when the alert status changes; `onActiveAlert`: Actions run when the alert becomes active and at each check interval while the rule conditions are met; `onThrottleInterval`: Actions run when the alert becomes active and at the interval specified in the throttle property while the rule conditions are met. NOTE: You cannot specify `notify_when` at both the rule and action level. The recommended method is to set it for each action. If you set it at the rule level then update the rule in Kibana, it is automatically changed to use action-specific values." },
        name: { type: "string", required: true, description: "Input parameter: The name of the rule. While this name does not have to be unique, a distinctive name can help you identify a rule." },
        flapping: { type: "string", required: false, description: "Input parameter: When flapping detection is turned on, alerts that switch quickly between active and recovered states are identified as “flapping” and notifications are reduced." },
        artifacts: { type: "string", required: false, description: "" },
        schedule: { type: "string", required: true, description: "" },
        alert_delay: { type: "string", required: false, description: "Input parameter: Indicates that an alert occurs only when the specified number of consecutive runs met the rule conditions." },
        params: { type: "string", required: false, description: "Input parameter: The parameters for the rule." },
        actions: { type: "string", required: false, description: "" },
        tags: { type: "string", required: false, description: "" },
            }
        },
        handler: getPut_Api_Alerting_Rule_IdHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPut_Api_Alerting_Rule_IdHandler,
    createPut_Api_Alerting_Rule_IdTool
};