import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { countRFunction } from "./tools/countR";

const server = new McpServer({
    name: "mcp-server-with-bun",
    version: "0.0.1",
    capabilities: {
        resources: {},
        tools: {}
    }
})

server.tool(
    "count-r",
    "Count the Rs in a string or word or sentence",
    {
        text: z.string()
    },
    countRFunction
);

console.log("[INFO]: Starting server")

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[INFO]: CountR MCP Server running on stdio");
};

main()
    .catch((error) => {
        console.error("[ERROR]: Fatal error in main():", error);
        process.exit(1);
    });
