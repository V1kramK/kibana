/**
 * MCP Server function for Create a space
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

function getPost_Api_Spaces_SpaceHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.color !== undefined) {
        queryParams.push(`color=${args.color}`);
    }
    if (args.description !== undefined) {
        queryParams.push(`description=${args.description}`);
    }
    if (args.id !== undefined) {
        queryParams.push(`id=${args.id}`);
    }
    if (args.imageUrl !== undefined) {
        queryParams.push(`imageUrl=${args.imageUrl}`);
    }
    if (args.initials !== undefined) {
        queryParams.push(`initials=${args.initials}`);
    }
    if (args.name !== undefined) {
        queryParams.push(`name=${args.name}`);
    }
    if (args._reserved !== undefined) {
        queryParams.push(`_reserved=${args._reserved}`);
    }
    if (args.disabledFeatures !== undefined) {
        queryParams.push(`disabledFeatures=${args.disabledFeatures}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/post_api_spaces_space${queryString}`;
            
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

function createPost_Api_Spaces_SpaceTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "post_api_spaces_space",
            description: "Create a space",
            parameters: {
        kbn-xsrf: { type: "string", required: true, description: "A required header to protect against CSRF attacks" },
        color: { type: "string", required: false, description: "Input parameter: The hexadecimal color code used in the space avatar. By default, the color is automatically generated from the space name." },
        description: { type: "string", required: false, description: "Input parameter: A description for the space." },
        id: { type: "string", required: true, description: "Input parameter: The space ID that is part of the Kibana URL when inside the space. Space IDs are limited to lowercase alphanumeric, underscore, and hyphen characters (a-z, 0-9, _, and -). You are cannot change the ID with the update operation." },
        imageUrl: { type: "string", required: false, description: "Input parameter: The data-URL encoded image to display in the space avatar. If specified, initials will not be displayed and the color will be visible as the background color for transparent images. For best results, your image should be 64x64. Images will not be optimized by this API call, so care should be taken when using custom images." },
        initials: { type: "string", required: false, description: "Input parameter: One or two characters that are shown in the space avatar. By default, the initials are automatically generated from the space name." },
        name: { type: "string", required: true, description: "Input parameter: The display name for the space." },
        _reserved: { type: "string", required: false, description: "" },
        disabledFeatures: { type: "string", required: false, description: "" },
            }
        },
        handler: getPost_Api_Spaces_SpaceHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPost_Api_Spaces_SpaceHandler,
    createPost_Api_Spaces_SpaceTool
};