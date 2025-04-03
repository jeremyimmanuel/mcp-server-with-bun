import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { countRFunction } from "./tools/count-r";
import { retrievePage, searchPage, createSimplePageInsidePage, appendBlock } from "./tools/notion";
import { markdownToBlocksTool } from "./tools/markdown-to-notion";
import { notionBlockBulletedListItemZod, notionBlockHeading1Zod, notionBlockHeading2Zod, notionBlockHeading3Zod, notionBlockNumberedListItemZod, notionBlockParagraphZod, notionBlockQuoteZod, notionBlockToggleZod } from "./utils/type";

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
);

server.tool(
    "notion-create-page",
    "Given a parentPageId, title, and description, create a notion page under the parent page. Description is optional, so try to generate the description from the conversation.",
    {
        parentPageId: z.string(),
        title: z.string(),
        description: z.string().optional(),
    },
    createSimplePageInsidePage
);

server.tool(
    "notion-append-block",
    "Given blockId or pageId, append a block within the block/page.",
    {
        blockId: z.string(),
        children: z.array(z.union([
            z.object({
                heading_1: notionBlockHeading1Zod,
            }),
            z.object({
                heading_2: notionBlockHeading2Zod
            }),
            z.object({
                heading_3: notionBlockHeading3Zod
            }),
            z.object({
                paragraph: notionBlockParagraphZod
            }),
            z.object({
                bulleted_list_item: notionBlockBulletedListItemZod
            }),
            z.object({
                numbered_list_item: notionBlockNumberedListItemZod
            }),
            z.object({
                quote: notionBlockQuoteZod
            }),
            z.object({
                toggle: notionBlockToggleZod
            }),
        ]))
    },
    appendBlock
);

server.tool(
    "markdown-to-blocks",
    "Converts markdown to notion blocks that we can pass in to notion-append-block",
    {
        markdown: z.string(),
    },
    markdownToBlocksTool
);

server.tool(
    "markdown-to-rich-text",
    "Converts markdown to notion rich text that we can pass in to notion-append-block",
    {
        markdown: z.string(),
    },
    markdownToBlocksTool
);

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
