# custom-mcp-server

A **custom Model Context Protocol (MCP) server** built on top of [mcp-framework](https://mcp-framework.com).  

This server connects to:  
- **Pokémon API** – fetch and interact with Pokémon data  
- **Binance API** – get real-time crypto market data  

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

Run the server locally:

```bash
npm run start
```

## Tools

### Pokémon Tool
* Fetch Pokémon details (types, abilities, stats)  
* Search Pokémon by name or ID  

### Binance Tool
* Get latest prices for trading pairs (e.g., BTC/USDT)  
* Access real-time crypto market data  

Each tool is built using the `MCPTool` class from `mcp-framework`.

