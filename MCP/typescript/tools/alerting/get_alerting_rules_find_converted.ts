/**
 * MCP Server function for Get information about rules
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

function getGet_Api_Alerting_Rules_FindHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
    return async function(ctx: any, request: MCPRequest): Promise<MCPToolResult> {
        try {
            const args = request?.params?.arguments || {};
            if (typeof args !== 'object') {
                return new MCPToolResultImpl("Invalid arguments object", true);
            }
            
            const queryParams: string[] = [];
    if (args.per_page !== undefined) {
        queryParams.push(`per_page=${args.per_page}`);
    }
    if (args.page !== undefined) {
        queryParams.push(`page=${args.page}`);
    }
    if (args.search !== undefined) {
        queryParams.push(`search=${args.search}`);
    }
    if (args.default_search_operator !== undefined) {
        queryParams.push(`default_search_operator=${args.default_search_operator}`);
    }
    if (args.search_fields !== undefined) {
        queryParams.push(`search_fields=${args.search_fields}`);
    }
    if (args.sort_field !== undefined) {
        queryParams.push(`sort_field=${args.sort_field}`);
    }
    if (args.sort_order !== undefined) {
        queryParams.push(`sort_order=${args.sort_order}`);
    }
    if (args.fields !== undefined) {
        queryParams.push(`fields=${args.fields}`);
    }
    if (args.filter !== undefined) {
        queryParams.push(`filter=${args.filter}`);
    }
    if (args.has_reference !== undefined) {
        queryParams.push(`has_reference=${args.has_reference}`);
    }
    if (args.filter_consumers !== undefined) {
        queryParams.push(`filter_consumers=${args.filter_consumers}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/get_api_alerting_rules_find${queryString}`;
            
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

function createGet_Api_Alerting_Rules_FindTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "get_api_alerting_rules_find",
            description: "Get information about rules",
            parameters: {
        per_page: { type: "string", required: false, description: "The number of rules to return per page." },
        page: { type: "string", required: false, description: "The page number to return." },
        search: { type: "string", required: false, description: "An Elasticsearch simple_query_string query that filters the objects in the response." },
        default_search_operator: { type: "string", required: false, description: "The default operator to use for the simple_query_string." },
        search_fields: { type: "string", required: false, description: "The fields to perform the simple_query_string parsed query against." },
        sort_field: { type: "string", required: false, description: "Determines which field is used to sort the results. The field must exist in the `attributes` key of the response." },
        sort_order: { type: "string", required: false, description: "Determines the sort order." },
        fields: { type: "string", required: false, description: "The fields to return in the `attributes` key of the response." },
        filter: { type: "string", required: false, description: "A KQL string that you filter with an attribute from your saved object. It should look like `savedObjectType.attributes.title: "myTitle"`. However, if you used a direct attribute of a saved object, such as `updatedAt`, you must define your filter, for example, `savedObjectType.updatedAt > 2018-12-22`." },
        has_reference: { type: "string", required: false, description: "Filters the rules that have a relation with the reference objects with a specific type and identifier." },
        filter_consumers: { type: "string", required: false, description: "" },
            }
        },
        handler: getGet_Api_Alerting_Rules_FindHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getGet_Api_Alerting_Rules_FindHandler,
    createGet_Api_Alerting_Rules_FindTool
};