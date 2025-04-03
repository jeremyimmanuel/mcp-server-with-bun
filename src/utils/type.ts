import { z } from "zod";

const textToolReturnType = z.object({
    content: z.array(z.object({
        type: z.literal("text"),
        text: z.string()
    }))
});

export type GenericTextReturnType = z.infer<typeof textToolReturnType>;

export const notionRichTextZod = z.object({
    text: z.object({
        content: z.string(),
        link: z.object({
            url: z.string()
        }).optional()
    }),
    annotations: z.object({
        bold: z.boolean(),
        italic: z.boolean(),
        strikethrough: z.boolean(),
        underline: z.boolean(),
        code: z.boolean(),
        color: z.enum([
            "default", "gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red",
            "default_background", "gray_background", "brown_background", "orange_background",
            "yellow_background", "green_background", "blue_background", "purple_background",
            "pink_background", "red_background"
        ]),
    }),
    plain_text: z.string(),
    href: z.string().optional(),
});

export const ApiColorZod = z.enum([
    "default", "gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red",
    "default_background", "gray_background", "brown_background", "orange_background",
    "yellow_background", "green_background", "blue_background", "purple_background",
    "pink_background", "red_background"
]);

export const CodeLanguageZod = z.enum([
    "abap", "agda", "arduino", "ascii art", "assembly", "bash", "basic", "bnf", "c", "c#", "c++",
    "clojure", "coffeescript", "coq", "css", "dart", "dhall", "diff", "docker", "ebnf", "elixir",
    "elm", "erlang", "f#", "flow", "fortran", "gherkin", "glsl", "go", "graphql", "groovy",
    "haskell", "hcl", "html", "idris", "java", "javascript", "json", "julia", "kotlin", "latex",
    "less", "lisp", "livescript", "llvm ir", "lua", "makefile", "markdown", "markup", "matlab",
    "mathematica", "mermaid", "nix", "notion formula", "objective-c", "ocaml", "pascal", "perl",
    "php", "plain text", "powershell", "prolog", "protobuf", "purescript", "python", "r", "racket",
    "reason", "ruby", "rust", "sass", "scala", "scheme", "scss", "shell", "smalltalk", "solidity",
    "sql", "swift", "toml", "typescript", "vb.net", "verilog", "vhdl", "visual basic", "webassembly",
    "xml", "yaml", "java/c/c++/c#"
]);

export const baseRichTextZod = z.object({
    rich_text: z.array(notionRichTextZod),
    color: ApiColorZod.optional(),
    is_toggleable: z.boolean(),
});

export const notionBlockHeading1Zod = baseRichTextZod;
export const notionBlockHeading2Zod = baseRichTextZod;
export const notionBlockHeading3Zod = baseRichTextZod;
export const notionBlockParagraphZod = baseRichTextZod.omit({ is_toggleable: true });
export const notionBlockBulletedListItemZod = baseRichTextZod.omit({ is_toggleable: true });
export const notionBlockNumberedListItemZod = baseRichTextZod.omit({ is_toggleable: true });
export const notionBlockQuoteZod = baseRichTextZod.omit({ is_toggleable: true });
export const notionBlockToggleZod = baseRichTextZod.omit({ is_toggleable: true });
export const notionBlockTodoZod = baseRichTextZod.omit({
    is_toggleable: true,
}).extend({
    checked: z.boolean().optional(),
});
export const notionBlockEquationZod = z.object({
    expression: z.string(),
});
export const notionBlockCodeZod = z.object({
    rich_text: notionRichTextZod
});
