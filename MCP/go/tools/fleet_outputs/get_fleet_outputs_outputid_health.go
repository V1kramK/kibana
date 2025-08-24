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

func Get_fleet_outputs_outputid_healthHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		outputIdVal, ok := args["outputId"]
		if !ok {
			return mcp.NewToolResultError("Missing required path parameter: outputId"), nil
		}
		outputId, ok := outputIdVal.(string)
		if !ok {
			return mcp.NewToolResultError("Invalid path parameter: outputId"), nil
		}
		url := fmt.Sprintf("%s/api/fleet/outputs/%s/health", cfg.BaseURL, outputId)
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

func CreateGet_fleet_outputs_outputid_healthTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("get_api_fleet_outputs_outputId_health",
		mcp.WithDescription("Get the latest output health"),
		mcp.WithString("outputId", mcp.Required(), mcp.Description("")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Get_fleet_outputs_outputid_healthHandler(cfg),
	}
}
