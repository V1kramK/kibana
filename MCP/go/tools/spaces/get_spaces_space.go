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

func Get_spaces_spaceHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		queryParams := make([]string, 0)
		if val, ok := args["purpose"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("purpose=%v", val))
		}
		if val, ok := args["include_authorized_purposes"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("include_authorized_purposes=%v", val))
		}
		queryString := ""
		if len(queryParams) > 0 {
			queryString = "?" + strings.Join(queryParams, "&")
		}
		url := fmt.Sprintf("%s/api/spaces/space%s", cfg.BaseURL, queryString)
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

func CreateGet_spaces_spaceTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("get_api_spaces_space",
		mcp.WithDescription("Get all spaces"),
		mcp.WithString("purpose", mcp.Description("Specifies which authorization checks are applied to the API call. The default value is `any`.")),
		mcp.WithString("include_authorized_purposes", mcp.Required(), mcp.Description("When enabled, the API returns any spaces that the user is authorized to access in any capacity and each space will contain the purposes for which the user is authorized. This can be useful to determine which spaces a user can read but not take a specific action in. If the security plugin is not enabled, this parameter has no effect, since no authorization checks take place. This parameter cannot be used in with the `purpose` parameter.")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Get_spaces_spaceHandler(cfg),
	}
}
