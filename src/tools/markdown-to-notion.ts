import { markdownToBlocks, markdownToRichText } from "@tryfabric/martian";

import type { GenericTextReturnType } from "../utils/type";

export const markdownToBlocksTool = ({
    markdown
}: {
    markdown: string
}): GenericTextReturnType => {
    return {
        content: [{
            type: "text",
            text: markdownToBlocks(markdown).toString(),
        }]
    }
};

export const markdownToRichTextTool = ({ markdown }: { markdown: string }) => {
    return {
        content: {
            type: "text",
            text: markdownToRichText(markdown).toString(),
        }
    }
};
