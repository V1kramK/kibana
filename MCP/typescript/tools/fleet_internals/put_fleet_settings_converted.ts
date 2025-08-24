/**
 * MCP Server function for Update settings
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

function getPut_Api_Fleet_SettingsHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.additional_yaml_config !== undefined) {
        queryParams.push(`additional_yaml_config=${args.additional_yaml_config}`);
    }
    if (args.kibana_ca_sha256 !== undefined) {
        queryParams.push(`kibana_ca_sha256=${args.kibana_ca_sha256}`);
    }
    if (args.prerelease_integrations_enabled !== undefined) {
        queryParams.push(`prerelease_integrations_enabled=${args.prerelease_integrations_enabled}`);
    }
    if (args.has_seen_add_data_notice !== undefined) {
        queryParams.push(`has_seen_add_data_notice=${args.has_seen_add_data_notice}`);
    }
    if (args.delete_unenrolled_agents !== undefined) {
        queryParams.push(`delete_unenrolled_agents=${args.delete_unenrolled_agents}`);
    }
    if (args.kibana_urls !== undefined) {
        queryParams.push(`kibana_urls=${args.kibana_urls}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/put_api_fleet_settings${queryString}`;
            
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

function createPut_Api_Fleet_SettingsTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "put_api_fleet_settings",
            description: "Update settings",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        additional_yaml_config: { type: "string", required: false, description: "" },
        kibana_ca_sha256: { type: "string", required: false, description: "" },
        prerelease_integrations_enabled: { type: "string", required: false, description: "" },
        has_seen_add_data_notice: { type: "string", required: false, description: "" },
        delete_unenrolled_agents: { type: "string", required: false, description: "" },
        kibana_urls: { type: "string", required: false, description: "" },
            }
        },
        handler: getPut_Api_Fleet_SettingsHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPut_Api_Fleet_SettingsHandler,
    createPut_Api_Fleet_SettingsTool
};