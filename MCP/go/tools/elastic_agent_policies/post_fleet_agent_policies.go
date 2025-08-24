package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"bytes"

	"github.com/kibana-http-apis/mcp-server/config"
	"github.com/kibana-http-apis/mcp-server/models"
	"github.com/mark3labs/mcp-go/mcp"
)

func Post_fleet_agent_policiesHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		queryParams := make([]string, 0)
		if val, ok := args["sys_monitoring"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("sys_monitoring=%v", val))
		}
		queryString := ""
		if len(queryParams) > 0 {
			queryString = "?" + strings.Join(queryParams, "&")
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
		url := fmt.Sprintf("%s/api/fleet/agent_policies%s", cfg.BaseURL, queryString)
		req, err := http.NewRequest("POST", url, bytes.NewBuffer(bodyBytes))
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

func CreatePost_fleet_agent_policiesTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("post_api_fleet_agent_policies",
		mcp.WithDescription("Create an agent policy"),
		mcp.WithString("kbn-xsrf", mcp.Required(), mcp.Description("A required header to protect against CSRF attacks")),
		mcp.WithBoolean("sys_monitoring", mcp.Description("")),
		mcp.WithArray("required_versions", mcp.Description("")),
		mcp.WithString("inactivity_timeout", mcp.Description("")),
		mcp.WithString("name", mcp.Required(), mcp.Description("")),
		mcp.WithObject("overrides", mcp.Description("Input parameter: Override settings that are defined in the agent policy. Input settings cannot be overridden. The override option should be used only in unusual circumstances and not as a routine procedure.")),
		mcp.WithBoolean("force", mcp.Description("")),
		mcp.WithArray("global_data_tags", mcp.Description("Input parameter: User defined data tags that are added to all of the inputs. The values can be strings or numbers.")),
		mcp.WithArray("space_ids", mcp.Description("")),
		mcp.WithBoolean("is_managed", mcp.Description("")),
		mcp.WithString("monitoring_output_id", mcp.Description("")),
		mcp.WithString("unenroll_timeout", mcp.Description("")),
		mcp.WithObject("agentless", mcp.Description("")),
		mcp.WithBoolean("is_default", mcp.Description("")),
		mcp.WithBoolean("is_default_fleet_server", mcp.Description("")),
		mcp.WithObject("monitoring_diagnostics", mcp.Description("")),
		mcp.WithBoolean("is_protected", mcp.Description("")),
		mcp.WithArray("agent_features", mcp.Description("")),
		mcp.WithString("fleet_server_host_id", mcp.Description("")),
		mcp.WithBoolean("supports_agentless", mcp.Description("Input parameter: Indicates whether the agent policy supports agentless integrations.")),
		mcp.WithBoolean("keep_monitoring_alive", mcp.Description("Input parameter: When set to true, monitoring will be enabled but logs/metrics collection will be disabled")),
		mcp.WithObject("monitoring_http", mcp.Description("")),
		mcp.WithBoolean("monitoring_pprof_enabled", mcp.Description("")),
		mcp.WithString("namespace", mcp.Required(), mcp.Description("")),
		mcp.WithString("data_output_id", mcp.Description("")),
		mcp.WithObject("advanced_settings", mcp.Description("")),
		mcp.WithArray("monitoring_enabled", mcp.Description("")),
		mcp.WithString("description", mcp.Description("")),
		mcp.WithBoolean("has_fleet_server", mcp.Description("")),
		mcp.WithString("id", mcp.Description("")),
		mcp.WithString("download_source_id", mcp.Description("")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Post_fleet_agent_policiesHandler(cfg),
	}
}
