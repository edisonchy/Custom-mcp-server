import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface GetAbilityInput {
  /** e.g. "static" or 9 */
  nameOrId: string;
  /** language code for effect entries (default "en") */
  lang?: string;
}

class GetAbilityTool extends MCPTool<GetAbilityInput> {
  name = "pokemon.ability.get";
  description = "Fetch a Pokémon ability by name or id (effect, short effect).";

  schema = {
    nameOrId: {
      type: z.string(),
      description: 'Ability name or id, e.g. "static" or "9".',
    },
    lang: {
      type: z.string().optional(),
      description: 'Language code for effect text (default "en").',
    },
  };

  private base = "https://pokeapi.co/api/v2";

  async execute(input: GetAbilityInput) {
    const lang = input.lang ?? "en";
    const url = `${this.base}/ability/${encodeURIComponent(input.nameOrId.toLowerCase())}`;
    const res = await fetch(url, { headers: { "User-Agent": "mcp-pokemon/1.0" } });

    if (res.status === 404) {
      return `No ability found for "${input.nameOrId}".`;
    }
    if (!res.ok) {
      throw new Error(`PokéAPI error ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as any;

    const effectEntry =
      (data.effect_entries || []).find((e: any) => e.language?.name === lang) ||
      (data.effect_entries || [])[0];

    const shortEffect = effectEntry?.short_effect ?? null;
    const effect = effectEntry?.effect ?? null;

    const summary = {
      id: data.id,
      name: data.name,
      effect,
      short_effect: shortEffect,
      generation: data?.generation?.name ?? null,
      pokemon_with_ability: (data.pokemon || [])
        .slice(0, 15)
        .map((p: any) => p?.pokemon?.name)
        .filter(Boolean),
      url: `https://pokeapi.co/api/v2/ability/${data.id}`,
    };

    return JSON.stringify(summary);
  }
}

export default GetAbilityTool;
