import { z } from "zod";

const countRFunctionReturnSchema = z.object({
    content: z.array(z.object({
        type: z.literal("text"),
        text: z.string()
    }))
});

type CountRFunctionReturnType = z.infer<typeof countRFunctionReturnSchema>;

export const countRFunction = ({ text }: { text: string }): CountRFunctionReturnType => {
    let count = 0;
    for (let i = 0; i < text.length; i++) {
        if (text.toLowerCase()[i] === "r") {
            count++;
        }
    }
    return {
        content: [
            {
                type: "text",
                text: `The number of Rs in this text is ${count}`
            }
        ]
    };
};
