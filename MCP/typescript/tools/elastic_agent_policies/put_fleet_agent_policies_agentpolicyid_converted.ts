/**
 * MCP Server function for Update an agent policy
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

function getPut_Api_Fleet_Agent_Policies_Agent_Policy_IdHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.agentPolicyId !== undefined) {
        queryParams.push(`agentPolicyId=${args.agentPolicyId}`);
    }
    if (args.format !== undefined) {
        queryParams.push(`format=${args.format}`);
    }
    if (args.monitoring_output_id !== undefined) {
        queryParams.push(`monitoring_output_id=${args.monitoring_output_id}`);
    }
    if (args.namespace !== undefined) {
        queryParams.push(`namespace=${args.namespace}`);
    }
    if (args.download_source_id !== undefined) {
        queryParams.push(`download_source_id=${args.download_source_id}`);
    }
    if (args.unenroll_timeout !== undefined) {
        queryParams.push(`unenroll_timeout=${args.unenroll_timeout}`);
    }
    if (args.id !== undefined) {
        queryParams.push(`id=${args.id}`);
    }
    if (args.data_output_id !== undefined) {
        queryParams.push(`data_output_id=${args.data_output_id}`);
    }
    if (args.fleet_server_host_id !== undefined) {
        queryParams.push(`fleet_server_host_id=${args.fleet_server_host_id}`);
    }
    if (args.description !== undefined) {
        queryParams.push(`description=${args.description}`);
    }
    if (args.name !== undefined) {
        queryParams.push(`name=${args.name}`);
    }
    if (args.inactivity_timeout !== undefined) {
        queryParams.push(`inactivity_timeout=${args.inactivity_timeout}`);
    }
    if (args.supports_agentless !== undefined) {
        queryParams.push(`supports_agentless=${args.supports_agentless}`);
    }
    if (args.force !== undefined) {
        queryParams.push(`force=${args.force}`);
    }
    if (args.keep_monitoring_alive !== undefined) {
        queryParams.push(`keep_monitoring_alive=${args.keep_monitoring_alive}`);
    }
    if (args.is_default !== undefined) {
        queryParams.push(`is_default=${args.is_default}`);
    }
    if (args.is_managed !== undefined) {
        queryParams.push(`is_managed=${args.is_managed}`);
    }
    if (args.is_default_fleet_server !== undefined) {
        queryParams.push(`is_default_fleet_server=${args.is_default_fleet_server}`);
    }
    if (args.has_fleet_server !== undefined) {
        queryParams.push(`has_fleet_server=${args.has_fleet_server}`);
    }
    if (args.monitoring_pprof_enabled !== undefined) {
        queryParams.push(`monitoring_pprof_enabled=${args.monitoring_pprof_enabled}`);
    }
    if (args.is_protected !== undefined) {
        queryParams.push(`is_protected=${args.is_protected}`);
    }
    if (args.bumpRevision !== undefined) {
        queryParams.push(`bumpRevision=${args.bumpRevision}`);
    }
    if (args.monitoring_http !== undefined) {
        queryParams.push(`monitoring_http=${args.monitoring_http}`);
    }
    if (args.agentless !== undefined) {
        queryParams.push(`agentless=${args.agentless}`);
    }
    if (args.monitoring_diagnostics !== undefined) {
        queryParams.push(`monitoring_diagnostics=${args.monitoring_diagnostics}`);
    }
    if (args.advanced_settings !== undefined) {
        queryParams.push(`advanced_settings=${args.advanced_settings}`);
    }
    if (args.overrides !== undefined) {
        queryParams.push(`overrides=${args.overrides}`);
    }
    if (args.space_ids !== undefined) {
        queryParams.push(`space_ids=${args.space_ids}`);
    }
    if (args.required_versions !== undefined) {
        queryParams.push(`required_versions=${args.required_versions}`);
    }
    if (args.agent_features !== undefined) {
        queryParams.push(`agent_features=${args.agent_features}`);
    }
    if (args.monitoring_enabled !== undefined) {
        queryParams.push(`monitoring_enabled=${args.monitoring_enabled}`);
    }
    if (args.global_data_tags !== undefined) {
        queryParams.push(`global_data_tags=${args.global_data_tags}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/put_api_fleet_agent_policies_agent_policy_id${queryString}`;
            
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

function createPut_Api_Fleet_Agent_Policies_Agent_Policy_IdTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "put_api_fleet_agent_policies_agent_policy_id",
            description: "Update an agent policy",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        agentPolicyId: { type: "string", required: true, description: "" },
        format: { type: "string", required: false, description: "" },
        monitoring_output_id: { type: "string", required: false, description: "" },
        namespace: { type: "string", required: true, description: "" },
        download_source_id: { type: "string", required: false, description: "" },
        unenroll_timeout: { type: "string", required: false, description: "" },
        id: { type: "string", required: false, description: "" },
        data_output_id: { type: "string", required: false, description: "" },
        fleet_server_host_id: { type: "string", required: false, description: "" },
        description: { type: "string", required: false, description: "" },
        name: { type: "string", required: true, description: "" },
        inactivity_timeout: { type: "string", required: false, description: "" },
        supports_agentless: { type: "string", required: false, description: "Input parameter: Indicates whether the agent policy supports agentless integrations." },
        force: { type: "string", required: false, description: "" },
        keep_monitoring_alive: { type: "string", required: false, description: "Input parameter: When set to true, monitoring will be enabled but logs/metrics collection will be disabled" },
        is_default: { type: "string", required: false, description: "" },
        is_managed: { type: "string", required: false, description: "" },
        is_default_fleet_server: { type: "string", required: false, description: "" },
        has_fleet_server: { type: "string", required: false, description: "" },
        monitoring_pprof_enabled: { type: "string", required: false, description: "" },
        is_protected: { type: "string", required: false, description: "" },
        bumpRevision: { type: "string", required: false, description: "" },
        monitoring_http: { type: "string", required: false, description: "" },
        agentless: { type: "string", required: false, description: "" },
        monitoring_diagnostics: { type: "string", required: false, description: "" },
        advanced_settings: { type: "string", required: false, description: "" },
        overrides: { type: "string", required: false, description: "Input parameter: Override settings that are defined in the agent policy. Input settings cannot be overridden. The override option should be used only in unusual circumstances and not as a routine procedure." },
        space_ids: { type: "string", required: false, description: "" },
        required_versions: { type: "string", required: false, description: "" },
        agent_features: { type: "string", required: false, description: "" },
        monitoring_enabled: { type: "string", required: false, description: "" },
        global_data_tags: { type: "string", required: false, description: "Input parameter: User defined data tags that are added to all of the inputs. The values can be strings or numbers." },
            }
        },
        handler: getPut_Api_Fleet_Agent_Policies_Agent_Policy_IdHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPut_Api_Fleet_Agent_Policies_Agent_Policy_IdHandler,
    createPut_Api_Fleet_Agent_Policies_Agent_Policy_IdTool
};