import { MCPTool } from "mcp-framework";
import { z } from "zod";
// If you're on Node < 18, uncomment and install node-fetch
// import fetch from "node-fetch";

interface GetBinancePriceInput {
  /** Binance trading pair, e.g. "BTCUSDT" */
  symbol: string;
}

class GetBinancePriceTool extends MCPTool<GetBinancePriceInput> {
  name = "binance.ticker_price.get";
  description =
    "Fetch the latest price for a Binance spot symbol (e.g. BTCUSDT) from /api/v3/ticker/price.";

  // Same shape as your example: { field: { type: zod, description } }
  schema = {
    symbol: {
      type: z
        .string()
        .trim()
        .min(1)
        .regex(/^[A-Za-z0-9:_-]+$/, "Provide a valid Binance symbol, e.g. BTCUSDT"),
      description: 'Binance symbol like "BTCUSDT", "ETHUSDT", etc.',
    },
  };

  private base = "https://api.binance.com/api/v3/ticker/price";

  async execute(input: GetBinancePriceInput) {
    const symbol = input.symbol.toUpperCase();

    const url = `${this.base}?symbol=${encodeURIComponent(symbol)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "mcp-binance/1.0" },
    });

    if (!res.ok) {
      // Try to surface Binance's JSON error (e.g. { code, msg })
      let bodyText = "";
      try {
        bodyText = await res.text();
      } catch {}
      throw new Error(
        `Binance API error ${res.status} ${res.statusText} for ${symbol}: ${bodyText || "no body"}`
      );
    }

    const data = (await res.json()) as { symbol: string; price: string };

    const priceNum = Number(data?.price);
    if (!Number.isFinite(priceNum)) {
      throw new Error(
        `Unexpected price format from Binance for ${symbol}: ${JSON.stringify(data)}`
      );
    }

    const summary = {
      symbol: data.symbol,
      price: data.price, // string, as returned by Binance
      price_num: priceNum, // numeric convenience
      fetchedAt: new Date().toISOString(),
      url,
    };

    // Mirror your Pokémon tool: return a compact JSON string
    return JSON.stringify(summary);
  }
}

export default GetBinancePriceTool;
