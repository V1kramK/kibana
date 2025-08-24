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

func Delete_alerting_rule_ruleid_snooze_schedule_scheduleidHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		ruleIdVal, ok := args["ruleId"]
		if !ok {
			return mcp.NewToolResultError("Missing required path parameter: ruleId"), nil
		}
		ruleId, ok := ruleIdVal.(string)
		if !ok {
			return mcp.NewToolResultError("Invalid path parameter: ruleId"), nil
		}
		scheduleIdVal, ok := args["scheduleId"]
		if !ok {
			return mcp.NewToolResultError("Missing required path parameter: scheduleId"), nil
		}
		scheduleId, ok := scheduleIdVal.(string)
		if !ok {
			return mcp.NewToolResultError("Invalid path parameter: scheduleId"), nil
		}
		url := fmt.Sprintf("%s/api/alerting/rule/%s/snooze_schedule/%s", cfg.BaseURL, ruleId, scheduleId)
		req, err := http.NewRequest("DELETE", url, nil)
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

func CreateDelete_alerting_rule_ruleid_snooze_schedule_scheduleidTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("delete_api_alerting_rule_ruleId_snooze_schedule_scheduleId",
		mcp.WithDescription("Delete a snooze schedule for a rule"),
		mcp.WithString("kbn-xsrf", mcp.Required(), mcp.Description("A required header to protect against CSRF attacks")),
		mcp.WithString("ruleId", mcp.Required(), mcp.Description("The identifier for the rule.")),
		mcp.WithString("scheduleId", mcp.Required(), mcp.Description("The identifier for the snooze schedule.")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Delete_alerting_rule_ruleid_snooze_schedule_scheduleidHandler(cfg),
	}
}
