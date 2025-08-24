package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/kibana-http-apis/mcp-server/config"
	"github.com/kibana-http-apis/mcp-server/models"
	"github.com/mark3labs/mcp-go/mcp"
)

func Get_fleet_agents_action_statusHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		queryParams := make([]string, 0)
		if val, ok := args["page"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("page=%v", val))
		}
		if val, ok := args["perPage"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("perPage=%v", val))
		}
		if val, ok := args["date"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("date=%v", val))
		}
		if val, ok := args["latest"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("latest=%v", val))
		}
		if val, ok := args["errorSize"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("errorSize=%v", val))
		}
		queryString := ""
		if len(queryParams) > 0 {
			queryString = "?" + strings.Join(queryParams, "&")
		}
		url := fmt.Sprintf("%s/api/fleet/agents/action_status%s", cfg.BaseURL, queryString)
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

func CreateGet_fleet_agents_action_statusTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("get_api_fleet_agents_action_status",
		mcp.WithDescription("Get an agent action status"),
		mcp.WithString("page", mcp.Description("")),
		mcp.WithString("perPage", mcp.Description("")),
		mcp.WithString("date", mcp.Description("")),
		mcp.WithString("latest", mcp.Description("")),
		mcp.WithString("errorSize", mcp.Description("")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Get_fleet_agents_action_statusHandler(cfg),
	}
}
