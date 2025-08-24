/**
 * MCP Server function for Update a proxy
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

function getPut_Api_Fleet_Proxies_Item_IdHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.itemId !== undefined) {
        queryParams.push(`itemId=${args.itemId}`);
    }
    if (args.name !== undefined) {
        queryParams.push(`name=${args.name}`);
    }
    if (args.url !== undefined) {
        queryParams.push(`url=${args.url}`);
    }
    if (args.certificate !== undefined) {
        queryParams.push(`certificate=${args.certificate}`);
    }
    if (args.certificate_authorities !== undefined) {
        queryParams.push(`certificate_authorities=${args.certificate_authorities}`);
    }
    if (args.certificate_key !== undefined) {
        queryParams.push(`certificate_key=${args.certificate_key}`);
    }
    if (args.proxy_headers !== undefined) {
        queryParams.push(`proxy_headers=${args.proxy_headers}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/put_api_fleet_proxies_item_id${queryString}`;
            
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

function createPut_Api_Fleet_Proxies_Item_IdTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "put_api_fleet_proxies_item_id",
            description: "Update a proxy",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        itemId: { type: "string", required: true, description: "" },
        name: { type: "string", required: false, description: "" },
        url: { type: "string", required: false, description: "" },
        certificate: { type: "string", required: true, description: "" },
        certificate_authorities: { type: "string", required: true, description: "" },
        certificate_key: { type: "string", required: true, description: "" },
        proxy_headers: { type: "string", required: true, description: "" },
            }
        },
        handler: getPut_Api_Fleet_Proxies_Item_IdHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPut_Api_Fleet_Proxies_Item_IdHandler,
    createPut_Api_Fleet_Proxies_Item_IdTool
};