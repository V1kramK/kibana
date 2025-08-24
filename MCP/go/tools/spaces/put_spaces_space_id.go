package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"bytes"

	"github.com/kibana-http-apis/mcp-server/config"
	"github.com/kibana-http-apis/mcp-server/models"
	"github.com/mark3labs/mcp-go/mcp"
)

func Put_spaces_space_idHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		idVal, ok := args["id"]
		if !ok {
			return mcp.NewToolResultError("Missing required path parameter: id"), nil
		}
		id, ok := idVal.(string)
		if !ok {
			return mcp.NewToolResultError("Invalid path parameter: id"), nil
		}
		// Create properly typed request body using the generated schema
		var requestBody map[string]interface{}
		
		// Optimized: Single marshal/unmarshal with JSON tags handling field mapping
		if argsJSON, err := json.Marshal(args); err == nil {
			if err := json.Unmarshal(argsJSON, &requestBody); err != nil {
				return mcp.NewToolResultError(fmt.Sprintf("Failed to convert arguments to request type: %v", err)), nil
			}
		} else {
			return mcp.NewToolResultError(fmt.Sprintf("Failed to marshal arguments: %v", err)), nil
		}
		
		bodyBytes, err := json.Marshal(requestBody)
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to encode request body", err), nil
		}
		url := fmt.Sprintf("%s/api/spaces/space/%s", cfg.BaseURL, id)
		req, err := http.NewRequest("PUT", url, bytes.NewBuffer(bodyBytes))
		req.Header.Set("Content-Type", "application/json")
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to create request", err), nil
		}
		// Set authentication based on auth type
		if cfg.BasicAuth != "" {
			req.Header.Set("Authorization", fmt.Sprintf("Basic %s", cfg.BasicAuth))
		}
		req.Header.Set("Accept", "application/json")
		if val, ok := args["kbn-xsrf"]; ok {
			req.Header.Set("kbn-xsrf", fmt.Sprintf("%v", val))
		}

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Request failed", err), nil
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to read response body", err), nil
		}

		if resp.StatusCode >= 400 {
			return mcp.NewToolResultError(fmt.Sprintf("API error: %s", body)), nil
		}
		// Use properly typed response
		var result map[string]interface{}
		if err := json.Unmarshal(body, &result); err != nil {
			// Fallback to raw text if unmarshaling fails
			return mcp.NewToolResultText(string(body)), nil
		}

		prettyJSON, err := json.MarshalIndent(result, "", "  ")
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to format JSON", err), nil
		}

		return mcp.NewToolResultText(string(prettyJSON)), nil
	}
}

func CreatePut_spaces_space_idTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("put_api_spaces_space_id",
		mcp.WithDescription("Update a space"),
		mcp.WithString("kbn-xsrf", mcp.Required(), mcp.Description("A required header to protect against CSRF attacks")),
		mcp.WithString("id", mcp.Required(), mcp.Description("The space identifier. You are unable to change the ID with the update operation.")),
		mcp.WithBoolean("_reserved", mcp.Description("")),
		mcp.WithString("color", mcp.Description("Input parameter: The hexadecimal color code used in the space avatar. By default, the color is automatically generated from the space name.")),
		mcp.WithString("description", mcp.Description("Input parameter: A description for the space.")),
		mcp.WithArray("disabledFeatures", mcp.Description("")),
		mcp.WithString("id", mcp.Required(), mcp.Description("Input parameter: The space ID that is part of the Kibana URL when inside the space. Space IDs are limited to lowercase alphanumeric, underscore, and hyphen characters (a-z, 0-9, _, and -). You are cannot change the ID with the update operation.")),
		mcp.WithString("imageUrl", mcp.Description("Input parameter: The data-URL encoded image to display in the space avatar. If specified, initials will not be displayed and the color will be visible as the background color for transparent images. For best results, your image should be 64x64. Images will not be optimized by this API call, so care should be taken when using custom images.")),
		mcp.WithString("initials", mcp.Description("Input parameter: One or two characters that are shown in the space avatar. By default, the initials are automatically generated from the space name.")),
		mcp.WithString("name", mcp.Required(), mcp.Description("Input parameter: The display name for the space. ")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Put_spaces_space_idHandler(cfg),
	}
}
