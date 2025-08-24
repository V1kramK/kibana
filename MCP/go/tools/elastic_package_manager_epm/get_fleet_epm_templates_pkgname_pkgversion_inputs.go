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

func Get_fleet_epm_templates_pkgname_pkgversion_inputsHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		pkgNameVal, ok := args["pkgName"]
		if !ok {
			return mcp.NewToolResultError("Missing required path parameter: pkgName"), nil
		}
		pkgName, ok := pkgNameVal.(string)
		if !ok {
			return mcp.NewToolResultError("Invalid path parameter: pkgName"), nil
		}
		pkgVersionVal, ok := args["pkgVersion"]
		if !ok {
			return mcp.NewToolResultError("Missing required path parameter: pkgVersion"), nil
		}
		pkgVersion, ok := pkgVersionVal.(string)
		if !ok {
			return mcp.NewToolResultError("Invalid path parameter: pkgVersion"), nil
		}
		queryParams := make([]string, 0)
		if val, ok := args["format"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("format=%v", val))
		}
		if val, ok := args["prerelease"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("prerelease=%v", val))
		}
		if val, ok := args["ignoreUnverified"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("ignoreUnverified=%v", val))
		}
		queryString := ""
		if len(queryParams) > 0 {
			queryString = "?" + strings.Join(queryParams, "&")
		}
		url := fmt.Sprintf("%s/api/fleet/epm/templates/%s/%s/inputs%s", cfg.BaseURL, pkgName, pkgVersion, queryString)
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
		var result interface{}
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

func CreateGet_fleet_epm_templates_pkgname_pkgversion_inputsTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("get_api_fleet_epm_templates_pkgName_pkgVersion_inputs",
		mcp.WithDescription("Get an inputs template"),
		mcp.WithString("pkgName", mcp.Required(), mcp.Description("")),
		mcp.WithString("pkgVersion", mcp.Required(), mcp.Description("")),
		mcp.WithString("format", mcp.Description("")),
		mcp.WithBoolean("prerelease", mcp.Description("")),
		mcp.WithBoolean("ignoreUnverified", mcp.Description("")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Get_fleet_epm_templates_pkgname_pkgversion_inputsHandler(cfg),
	}
}
