# mcp-server-with-bun

This is an mcp server using `bun.sh`.

## Scripts

To install dependencies:

```bash
bun install
```

To run:

```bash
bun server
```

Inpsect/debug mcp server:

```bash
bun debug
```

This project was created using `bun init` in bun v1.2.5. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Connecting to Claude Desktop

Make sure to include this config in your `claude_desktop_config.json` file.

```json
{
  "mcpServers": {
    "mcp-server-playground": {
      "command": "PATH-to-bun",
      "args": [
        "PATH-to-index.ts"
      ],
      "env": {
        "NOTION_TOKEN": "YOUR_NOTION_TOKEN"
      }
    },
  },
}
```
