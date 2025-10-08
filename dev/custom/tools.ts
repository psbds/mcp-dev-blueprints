
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCustomTool } from "../../src/features/index.js";
import { z } from "zod";

export default function addTools() {
    registerCustomTool("azure_status_check", registerAzureStatusCheckTool);
}

async function registerAzureStatusCheckTool(server: McpServer) {
    server.registerTool(
        "azure_status_check",
        {
            title: "Azure Service Status Checker",
            description: "Check the current status of Azure services to see if any are experiencing issues or outages.",
            inputSchema: {
                service: z.string().optional().describe("Optional: Specific Azure service to check (e.g., 'Azure App Service', 'Azure SQL Database'). If not provided, checks all services."),
                region: z.string().optional().describe("Optional: Specific Azure region to check (e.g., 'East US', 'West Europe'). If not provided, checks globally.")
            }
        },
        async ({ service, region }) => {
            try {
                // Call Azure Status API
                const response = await fetch('https://status.azure.com/api/v2/status', {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'MCP-Azure-Status-Checker'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Azure Status API returned ${response.status}: ${response.statusText}`);
                }

                const statusData = await response.json();

                // Also get current incidents
                const incidentsResponse = await fetch('https://status.azure.com/api/v2/incidents/current', {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'MCP-Azure-Status-Checker'
                    }
                });

                let incidents = [];
                if (incidentsResponse.ok) {
                    const incidentsData = await incidentsResponse.json();
                    incidents = incidentsData.incidents || [];
                }

                // Filter by service and/or region if specified
                let filteredIncidents = incidents;
                if (service) {
                    filteredIncidents = filteredIncidents.filter((incident: any) =>
                        incident.title?.toLowerCase().includes(service.toLowerCase()) ||
                        incident.summary?.toLowerCase().includes(service.toLowerCase()) ||
                        (incident.impactedServices || []).some((svc: any) =>
                            svc.ServiceName?.toLowerCase().includes(service.toLowerCase())
                        )
                    );
                }

                if (region) {
                    filteredIncidents = filteredIncidents.filter((incident: any) =>
                        (incident.impactedServices || []).some((svc: any) =>
                            (svc.ImpactedRegions || []).some((reg: any) =>
                                reg.RegionName?.toLowerCase().includes(region.toLowerCase())
                            )
                        )
                    );
                }

                // Format the response
                let statusReport = "";

                // Overall status
                const overallStatus = statusData.status || "Unknown";
                statusReport += `## Azure Service Status Overview\n\n`;
                statusReport += `**Overall Status**: ${overallStatus}\n`;
                statusReport += `**Last Updated**: ${new Date().toISOString()}\n\n`;

                // Current incidents
                if (filteredIncidents.length === 0) {
                    statusReport += "✅ **No current incidents found**";
                    if (service) statusReport += ` for service "${service}"`;
                    if (region) statusReport += ` in region "${region}"`;
                    statusReport += "\n\n";
                } else {
                    statusReport += `⚠️ **Current Incidents (${filteredIncidents.length})**\n\n`;

                    for (const incident of filteredIncidents) {
                        statusReport += `### ${incident.title || 'Incident'}\n`;
                        statusReport += `- **Status**: ${incident.status || 'Unknown'}\n`;
                        statusReport += `- **Severity**: ${incident.severity || 'Unknown'}\n`;
                        statusReport += `- **Started**: ${incident.startDateTime || 'Unknown'}\n`;

                        if (incident.summary) {
                            statusReport += `- **Summary**: ${incident.summary}\n`;
                        }

                        if (incident.impactedServices && incident.impactedServices.length > 0) {
                            statusReport += `- **Impacted Services**:\n`;
                            for (const svc of incident.impactedServices) {
                                statusReport += `  - ${svc.ServiceName || 'Unknown Service'}`;
                                if (svc.ImpactedRegions && svc.ImpactedRegions.length > 0) {
                                    const regions = svc.ImpactedRegions.map((r: any) => r.RegionName).join(', ');
                                    statusReport += ` (${regions})`;
                                }
                                statusReport += '\n';
                            }
                        }

                        if (incident.trackingId) {
                            statusReport += `- **Tracking ID**: ${incident.trackingId}\n`;
                        }

                        statusReport += '\n';
                    }
                }

                // Add helpful information
                statusReport += `## Additional Information\n\n`;
                statusReport += `- Full Azure Status Dashboard: https://status.azure.com/\n`;
                statusReport += `- Subscribe to status updates: https://status.azure.com/status/feed/\n`;

                if (service && filteredIncidents.length === 0) {
                    statusReport += `\n*Note: No incidents found for "${service}". The service appears to be operating normally.*\n`;
                }

                return {
                    content: [{
                        type: "text",
                        text: statusReport
                    }]
                };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                return {
                    content: [{
                        type: "text",
                        text: `❌ **Error checking Azure status**: ${errorMessage}\n\nPlease try again later or check https://status.azure.com/ directly.`
                    }]
                };
            }
        }
    );
};