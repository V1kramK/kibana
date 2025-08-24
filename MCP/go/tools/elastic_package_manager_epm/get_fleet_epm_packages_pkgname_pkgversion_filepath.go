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

func Get_fleet_epm_packages_pkgname_pkgversion_filepathHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
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
		filePathVal, ok := args["filePath"]
		if !ok {
			return mcp.NewToolResultError("Missing required path parameter: filePath"), nil
		}
		filePath, ok := filePathVal.(string)
		if !ok {
			return mcp.NewToolResultError("Invalid path parameter: filePath"), nil
		}
		url := fmt.Sprintf("%s/api/fleet/epm/packages/%s/%s/%s", cfg.BaseURL, pkgName, pkgVersion, filePath)
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

func CreateGet_fleet_epm_packages_pkgname_pkgversion_filepathTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("get_api_fleet_epm_packages_pkgName_pkgVersion_filePath",
		mcp.WithDescription("Get a package file"),
		mcp.WithString("pkgName", mcp.Required(), mcp.Description("")),
		mcp.WithString("pkgVersion", mcp.Required(), mcp.Description("")),
		mcp.WithString("filePath", mcp.Required(), mcp.Description("")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Get_fleet_epm_packages_pkgname_pkgversion_filepathHandler(cfg),
	}
}
