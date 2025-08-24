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

func Put_alerting_rule_idHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
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
		url := fmt.Sprintf("%s/api/alerting/rule/%s", cfg.BaseURL, id)
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

func CreatePut_alerting_rule_idTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("put_api_alerting_rule_id",
		mcp.WithDescription("Update a rule"),
		mcp.WithString("kbn-xsrf", mcp.Required(), mcp.Description("A required header to protect against CSRF attacks")),
		mcp.WithString("id", mcp.Required(), mcp.Description("The identifier for the rule.")),
		mcp.WithString("throttle", mcp.Description("Input parameter: Use the `throttle` property in the action `frequency` object instead. The throttle interval, which defines how often an alert generates repeated actions. NOTE: You cannot specify the throttle interval at both the rule and action level. If you set it at the rule level then update the rule in Kibana, it is automatically changed to use action-specific values.")),
		mcp.WithArray("actions", mcp.Description("")),
		mcp.WithObject("flapping", mcp.Description("Input parameter: When flapping detection is turned on, alerts that switch quickly between active and recovered states are identified as “flapping” and notifications are reduced.")),
		mcp.WithString("notify_when", mcp.Description("Input parameter: Indicates how often alerts generate actions. Valid values include: `onActionGroupChange`: Actions run when the alert status changes; `onActiveAlert`: Actions run when the alert becomes active and at each check interval while the rule conditions are met; `onThrottleInterval`: Actions run when the alert becomes active and at the interval specified in the throttle property while the rule conditions are met. NOTE: You cannot specify `notify_when` at both the rule and action level. The recommended method is to set it for each action. If you set it at the rule level then update the rule in Kibana, it is automatically changed to use action-specific values.")),
		mcp.WithArray("tags", mcp.Description("")),
		mcp.WithObject("artifacts", mcp.Description("")),
		mcp.WithObject("schedule", mcp.Required(), mcp.Description("")),
		mcp.WithString("name", mcp.Required(), mcp.Description("Input parameter: The name of the rule. While this name does not have to be unique, a distinctive name can help you identify a rule.")),
		mcp.WithObject("alert_delay", mcp.Description("Input parameter: Indicates that an alert occurs only when the specified number of consecutive runs met the rule conditions.")),
		mcp.WithObject("params", mcp.Description("Input parameter: The parameters for the rule.")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Put_alerting_rule_idHandler(cfg),
	}
}
