# custom-mcp-server

A **custom Model Context Protocol (MCP) server** built on top of [mcp-framework](https://mcp-framework.com).  

This server connects to:  
- **Pokémon API** – fetch and interact with Pokémon data  
- **Binance API** – get real-time crypto market data  

---

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

Run the server locally:

```bash
node dist/index.js
```

---

## Project Structure

```
custom-mcp-server/
├── src/
│   ├── tools/        
│   │   ├── PokemonTool.ts     # Interact with Pokémon API
│   │   ├── BinanceTool.ts     # Interact with Binance API
│   │   └── ExampleTool.ts     # Example starter tool
│   └── index.ts               # Server entry point
├── package.json
└── tsconfig.json
```

---

## Tools

### Pokémon Tool
- Fetch Pokémon details (types, abilities, stats)  
- Search Pokémon by name or ID  

### Binance Tool
- Get latest prices for trading pairs (e.g., BTC/USDT)  
- Access real-time crypto market data  

Each tool is built using the `MCPTool` class from `mcp-framework`.

---

## Example Tool Implementation

```typescript
import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface PriceInput {
  symbol: string;
}

class BinanceTool extends MCPTool<PriceInput> {
  name = "binance_price";
  description = "Fetch latest price for a trading pair from Binance";

  schema = {
    symbol: {
      type: z.string(),
      description: "Trading pair symbol, e.g., BTCUSDT",
    },
  };

  async execute(input: PriceInput) {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${input.symbol}`);
    const data = await res.json();
    return `Price of ${input.symbol}: ${data.price}`;
  }
}

export default BinanceTool;
```

---

## Publishing to npm

1. Update **package.json** (`name`, `version`, `description`, etc.)  
2. Build & test locally:
   ```bash
   npm run build
   npm link
   custom-mcp-server
   ```
3. Publish:
   ```bash
   npm login
   npm publish
   ```

---

## Using with Claude Desktop

### Local Development

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`  

```json
{
  "mcpServers": {
    "custom-mcp-server": {
      "command": "node",
      "args": ["/absolute/path/to/custom-mcp-server/dist/index.js"]
    }
  }
}
```

### After Publishing

```json
{
  "mcpServers": {
    "custom-mcp-server": {
      "command": "npx",
      "args": ["custom-mcp-server"]
    }
  }
}
```

---

## Building and Testing

1. Add or modify tools in `src/tools/`  
2. Compile:
   ```bash
   npm run build
   ```
3. Run your server and test the Pokémon & Binance tools.

---

## Learn More

- [MCP Framework GitHub](https://github.com/QuantGeekDev/mcp-framework)  
- [MCP Framework Docs](https://mcp-framework.com)  
- [Pokémon API](https://pokeapi.co/)  
- [Binance API](https://binance-docs.github.io/apidocs/)  
