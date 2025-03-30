import { Client } from "@notionhq/client";
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
    const searchResponse = await notion.search({
        query,
        filter: {
            property: "object",
            value: "page"
        },
        page_size: 5
    });
    console.log("jeremy searchResponse", searchResponse)
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
