import { Client } from "@notionhq/client";
import type { BlockObjectRequest, GetPageResponse } from "@notionhq/client/build/src/api-endpoints";
import { config } from "dotenv"
import { z } from "zod";

config();

// Initializing a client
export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const textToolReturnType = z.object({
    content: z.array(z.object({
        type: z.literal("text"),
        text: z.string()
    }))
});

type GenericTextReturnType = z.infer<typeof textToolReturnType>

/**
 * Search for a page in your notion database
 * @param param0
 * @returns
 */
export const searchPage = async ({ query }: { query: string}): Promise<GenericTextReturnType> => {
    let searchResponse;
    try {
        searchResponse = await notion.search({
            query,
            filter: {
                property: "object",
                value: "page"
            },
            page_size: 5
        });
    } catch (error) {
        return {
            content: [{
                type: "text",
                text: `${error.code}: ${process.env.NOTION_TOKEN}`
            }]
        }
    }
    const pageIds = searchResponse?.results?.map(page => page.id);
    if (pageIds.length === 0) {
        return {
            content: [
                {
                    type: "text",
                    text: `There were no pages found for query ${query}.`
                }
            ]
        }
    };

    return {
        content: [
            {
                type: "text",
                text: `The top ${pageIds.length} results for query "${query}" are:\n${pageIds.join(", ")}`
            }
        ]
    }
};

/**
 * MCP Tool
 * @param param0
 * @returns
 */
export const retrievePage = async ({ pageId }: { pageId: string}): Promise<GenericTextReturnType> => {
    const retrievePageResponse: GetPageResponse = await notion.pages.retrieve({
        page_id: pageId
    });

    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(retrievePageResponse)
            }
        ]
    }
};

/**
 *
 * @param param0
 * @returns
 */
export const createSimplePageInsidePage = async ({
    parentPageId,
    title,
    description
}: {
    parentPageId: string,
    title: string,
    description?: string
}): Promise<GenericTextReturnType> => {
    try {
        const response = await notion.pages.create({
            parent: {
                page_id: parentPageId,
            },
            properties: {
                // Since this is under a page, the only option is "title"
                "title": {
                    title: [
                        {
                            text: {
                            content: title,
                            },
                        },
                    ],
                },
            },
        });

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(response),
                }
            ]
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(error),
                }
            ]
        };
    }
  };

export const appendBlock = async({
    blockId,
    children,
}: {
    blockId: string,
    children: Array<BlockObjectRequest>
}) => {
    const response = await notion.blocks.children.append({
        block_id: blockId,
        children: children,
    });

    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(response),
            }
        ]
    };
};
