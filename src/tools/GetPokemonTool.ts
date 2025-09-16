import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface GetPokemonInput {
  /** e.g. "pikachu" or 25 */
  nameOrId: string;
  /** limit how many moves to include (default 0 = omit) */
  moves_limit?: number;
  /** include a small PNG sprite URL (default true) */
  include_sprite?: boolean;
}

class GetPokemonTool extends MCPTool<GetPokemonInput> {
  name = "pokemon.get";
  description =
    "Fetch a Pokémon by name or id (types, base stats, abilities, optional sprite and a few moves).";

  // Same shape as your example: { field: { type: zod, description } }
  schema = {
    nameOrId: {
      type: z.string(),
      description: 'Pokémon name or numeric id, e.g. "pikachu" or "25".',
    },
    moves_limit: {
      type: z.number().int().min(0).max(50).optional(),
      description:
        "Max number of moves to include (0=omit). Default 0. Max 50.",
    },
    include_sprite: {
      type: z.boolean().optional(),
      description: "Include the default front sprite URL. Default true.",
    },
  };

  private base = "https://pokeapi.co/api/v2";

  async execute(input: GetPokemonInput) {
    const movesLimit =
      typeof input.moves_limit === "number" ? input.moves_limit : 0;
    const includeSprite =
      typeof input.include_sprite === "boolean" ? input.include_sprite : true;

    const url = `${this.base}/pokemon/${encodeURIComponent(input.nameOrId.toLowerCase())}`;
    const res = await fetch(url, { headers: { "User-Agent": "mcp-pokemon/1.0" } });

    if (res.status === 404) {
      return `No Pokémon found for "${input.nameOrId}".`;
    }
    if (!res.ok) {
      throw new Error(`PokéAPI error ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as any;

    const types: string[] = (data.types || [])
      .map((t: any) => t?.type?.name)
      .filter(Boolean);

    const stats: Record<string, number> = {};
    for (const s of data.stats || []) {
      if (s?.stat?.name && typeof s.base_stat === "number") {
        stats[s.stat.name] = s.base_stat;
      }
    }

    const abilities: string[] = (data.abilities || [])
      .map((a: any) => a?.ability?.name)
      .filter(Boolean);

    const moves: string[] =
      movesLimit > 0
        ? (data.moves || [])
            .slice(0, movesLimit)
            .map((m: any) => m?.move?.name)
            .filter(Boolean)
        : [];

    const sprite =
      includeSprite ? data?.sprites?.front_default ?? null : null;

    // Keep it compact but readable — return a single string (like your example),
    // or swap to returning an object if your framework supports structured output.
    const summary = {
      id: data.id,
      name: data.name,
      height: data.height, // decimeters
      weight: data.weight, // hectograms
      types,
      stats,
      abilities,
      moves,
      sprite,
      url: `https://pokeapi.co/api/v2/pokemon/${data.id}`,
    };

    return JSON.stringify(summary);
  }
}

export default GetPokemonTool;
