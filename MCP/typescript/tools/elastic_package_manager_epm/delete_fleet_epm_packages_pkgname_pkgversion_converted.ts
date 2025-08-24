/**
 * MCP Server function for Delete a package
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

function getDelete_Api_Fleet_Epm_Packages_Pkg_Name_Pkg_VersionHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.pkgName !== undefined) {
        queryParams.push(`pkgName=${args.pkgName}`);
    }
    if (args.pkgVersion !== undefined) {
        queryParams.push(`pkgVersion=${args.pkgVersion}`);
    }
    if (args.force !== undefined) {
        queryParams.push(`force=${args.force}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/delete_api_fleet_epm_packages_pkg_name_pkg_version${queryString}`;
            
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

function createDelete_Api_Fleet_Epm_Packages_Pkg_Name_Pkg_VersionTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "delete_api_fleet_epm_packages_pkg_name_pkg_version",
            description: "Delete a package",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        pkgName: { type: "string", required: true, description: "" },
        pkgVersion: { type: "string", required: false, description: "" },
        force: { type: "string", required: false, description: "" },
            }
        },
        handler: getDelete_Api_Fleet_Epm_Packages_Pkg_Name_Pkg_VersionHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getDelete_Api_Fleet_Epm_Packages_Pkg_Name_Pkg_VersionHandler,
    createDelete_Api_Fleet_Epm_Packages_Pkg_Name_Pkg_VersionTool
};