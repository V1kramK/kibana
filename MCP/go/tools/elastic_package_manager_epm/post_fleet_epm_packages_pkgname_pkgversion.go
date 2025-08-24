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

func Post_fleet_epm_packages_pkgname_pkgversionHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
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
		if val, ok := args["prerelease"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("prerelease=%v", val))
		}
		if val, ok := args["ignoreMappingUpdateErrors"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("ignoreMappingUpdateErrors=%v", val))
		}
		if val, ok := args["skipDataStreamRollover"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("skipDataStreamRollover=%v", val))
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
		url := fmt.Sprintf("%s/api/fleet/epm/packages/%s/%s%s", cfg.BaseURL, pkgName, pkgVersion, queryString)
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

func CreatePost_fleet_epm_packages_pkgname_pkgversionTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("post_api_fleet_epm_packages_pkgName_pkgVersion",
		mcp.WithDescription("Install a package from the registry"),
		mcp.WithString("kbn-xsrf", mcp.Required(), mcp.Description("A required header to protect against CSRF attacks")),
		mcp.WithString("pkgName", mcp.Required(), mcp.Description("")),
		mcp.WithString("pkgVersion", mcp.Description("")),
		mcp.WithBoolean("prerelease", mcp.Description("")),
		mcp.WithBoolean("ignoreMappingUpdateErrors", mcp.Description("")),
		mcp.WithBoolean("skipDataStreamRollover", mcp.Description("")),
		mcp.WithBoolean("ignore_constraints", mcp.Description("")),
		mcp.WithBoolean("force", mcp.Description("")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Post_fleet_epm_packages_pkgname_pkgversionHandler(cfg),
	}
}
