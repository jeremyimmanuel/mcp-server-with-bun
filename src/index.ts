import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { countRFunction } from "./tools/count-r";
import { retrievePage, searchPage } from "./tools/notion";

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

server.tool(
    "notion-search-page",
    "Search page in my notion workspace (Jeremy's private workspace)",
    {
        query: z.string()
    },
    searchPage
);

server.tool(
    "notion-retrieve-page",
    "Retrieve notion page and get the page's following information id, create time, last edited time, created by, last edited by, cover, icon, parent, archived, in trash, properties, url, public url",
    {
        pageId: z.string()
    },
    retrievePage
)

async function main() {
    console.log("Starting server...")
    const transport = new StdioServerTransport();
    await server.connect(transport);
};

main()
    .catch((error) => {
        console.error("[ERROR]: Fatal error in main():", error);
        process.exit(1);
    });
