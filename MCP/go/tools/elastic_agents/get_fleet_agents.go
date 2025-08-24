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

func Get_fleet_agentsHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
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
		if val, ok := args["kuery"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("kuery=%v", val))
		}
		if val, ok := args["showAgentless"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("showAgentless=%v", val))
		}
		if val, ok := args["showInactive"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("showInactive=%v", val))
		}
		if val, ok := args["withMetrics"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("withMetrics=%v", val))
		}
		if val, ok := args["showUpgradeable"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("showUpgradeable=%v", val))
		}
		if val, ok := args["getStatusSummary"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("getStatusSummary=%v", val))
		}
		if val, ok := args["sortField"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("sortField=%v", val))
		}
		if val, ok := args["sortOrder"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("sortOrder=%v", val))
		}
		if val, ok := args["searchAfter"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("searchAfter=%v", val))
		}
		if val, ok := args["openPit"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("openPit=%v", val))
		}
		if val, ok := args["pitId"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("pitId=%v", val))
		}
		if val, ok := args["pitKeepAlive"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("pitKeepAlive=%v", val))
		}
		queryString := ""
		if len(queryParams) > 0 {
			queryString = "?" + strings.Join(queryParams, "&")
		}
		url := fmt.Sprintf("%s/api/fleet/agents%s", cfg.BaseURL, queryString)
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

func CreateGet_fleet_agentsTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("get_api_fleet_agents",
		mcp.WithDescription("Get agents"),
		mcp.WithString("page", mcp.Description("")),
		mcp.WithString("perPage", mcp.Description("")),
		mcp.WithString("kuery", mcp.Description("")),
		mcp.WithBoolean("showAgentless", mcp.Description("")),
		mcp.WithBoolean("showInactive", mcp.Description("")),
		mcp.WithBoolean("withMetrics", mcp.Description("")),
		mcp.WithBoolean("showUpgradeable", mcp.Description("")),
		mcp.WithBoolean("getStatusSummary", mcp.Description("")),
		mcp.WithString("sortField", mcp.Description("")),
		mcp.WithString("sortOrder", mcp.Description("")),
		mcp.WithString("searchAfter", mcp.Description("")),
		mcp.WithBoolean("openPit", mcp.Description("")),
		mcp.WithString("pitId", mcp.Description("")),
		mcp.WithString("pitKeepAlive", mcp.Description("")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Get_fleet_agentsHandler(cfg),
	}
}
