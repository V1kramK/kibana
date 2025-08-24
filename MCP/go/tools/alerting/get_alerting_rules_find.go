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

func Get_alerting_rules_findHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		queryParams := make([]string, 0)
		if val, ok := args["per_page"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("per_page=%v", val))
		}
		if val, ok := args["page"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("page=%v", val))
		}
		if val, ok := args["search"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("search=%v", val))
		}
		if val, ok := args["default_search_operator"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("default_search_operator=%v", val))
		}
		if val, ok := args["search_fields"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("search_fields=%v", val))
		}
		if val, ok := args["sort_field"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("sort_field=%v", val))
		}
		if val, ok := args["sort_order"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("sort_order=%v", val))
		}
		if val, ok := args["has_reference"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("has_reference=%v", val))
		}
		if val, ok := args["fields"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("fields=%v", val))
		}
		if val, ok := args["filter"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("filter=%v", val))
		}
		if val, ok := args["filter_consumers"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("filter_consumers=%v", val))
		}
		queryString := ""
		if len(queryParams) > 0 {
			queryString = "?" + strings.Join(queryParams, "&")
		}
		url := fmt.Sprintf("%s/api/alerting/rules/_find%s", cfg.BaseURL, queryString)
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

func CreateGet_alerting_rules_findTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("get_api_alerting_rules__find",
		mcp.WithDescription("Get information about rules"),
		mcp.WithString("per_page", mcp.Description("The number of rules to return per page.")),
		mcp.WithString("page", mcp.Description("The page number to return.")),
		mcp.WithString("search", mcp.Description("An Elasticsearch simple_query_string query that filters the objects in the response.")),
		mcp.WithString("default_search_operator", mcp.Description("The default operator to use for the simple_query_string.")),
		mcp.WithString("search_fields", mcp.Description("The fields to perform the simple_query_string parsed query against.")),
		mcp.WithString("sort_field", mcp.Description("Determines which field is used to sort the results. The field must exist in the `attributes` key of the response.")),
		mcp.WithString("sort_order", mcp.Description("Determines the sort order.")),
		mcp.WithObject("has_reference", mcp.Description("Filters the rules that have a relation with the reference objects with a specific type and identifier.")),
		mcp.WithString("fields", mcp.Description("The fields to return in the `attributes` key of the response.")),
		mcp.WithString("filter", mcp.Description("A KQL string that you filter with an attribute from your saved object. It should look like `savedObjectType.attributes.title: \"myTitle\"`. However, if you used a direct attribute of a saved object, such as `updatedAt`, you must define your filter, for example, `savedObjectType.updatedAt > 2018-12-22`.")),
		mcp.WithArray("filter_consumers", mcp.Description("")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Get_alerting_rules_findHandler(cfg),
	}
}
