package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/kibana-http-apis/mcp-server/config"
	"github.com/kibana-http-apis/mcp-server/models"
	"github.com/mark3labs/mcp-go/mcp"
)

func Get_fleet_agents_files_fileid_filenameHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		fileIdVal, ok := args["fileId"]
		if !ok {
			return mcp.NewToolResultError("Missing required path parameter: fileId"), nil
		}
		fileId, ok := fileIdVal.(string)
		if !ok {
			return mcp.NewToolResultError("Invalid path parameter: fileId"), nil
		}
		fileNameVal, ok := args["fileName"]
		if !ok {
			return mcp.NewToolResultError("Missing required path parameter: fileName"), nil
		}
		fileName, ok := fileNameVal.(string)
		if !ok {
			return mcp.NewToolResultError("Invalid path parameter: fileName"), nil
		}
		url := fmt.Sprintf("%s/api/fleet/agents/files/%s/%s", cfg.BaseURL, fileId, fileName)
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to create request", err), nil
		}
		// Set authentication based on auth type
		if cfg.BasicAuth != "" {
			req.Header.Set("Authorization", fmt.Sprintf("Basic %s", cfg.BasicAuth))
		}
		req.Header.Set("Accept", "application/json")

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

func CreateGet_fleet_agents_files_fileid_filenameTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("get_api_fleet_agents_files_fileId_fileName",
		mcp.WithDescription("Get an uploaded file"),
		mcp.WithString("fileId", mcp.Required(), mcp.Description("")),
		mcp.WithString("fileName", mcp.Required(), mcp.Description("")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Get_fleet_agents_files_fileid_filenameHandler(cfg),
	}
}
