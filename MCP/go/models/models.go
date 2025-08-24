package models

import (
	"context"
	"github.com/mark3labs/mcp-go/mcp"
)

type Tool struct {
	Definition mcp.Tool
	Handler    func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error)
}

// CorestatusredactedResponse represents the CorestatusredactedResponse schema from the OpenAPI specification
type CorestatusredactedResponse struct {
	Status map[string]interface{} `json:"status"`
}

// Corestatusresponse represents the Corestatusresponse schema from the OpenAPI specification
type Corestatusresponse struct {
	Uuid string `json:"uuid"` // Unique, generated Kibana instance UUID. This UUID should persist even if the Kibana process restarts.
	Version map[string]interface{} `json:"version"`
	Metrics map[string]interface{} `json:"metrics"` // Metric groups collected by Kibana.
	Name string `json:"name"` // Kibana instance name.
	Status map[string]interface{} `json:"status"`
}
