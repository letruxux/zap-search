import BaseResult, { type ProviderInfo } from "shared/defs";
import search, { rankItems } from "./utils";
import allProviders from "./providers";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/serve-static";

import { serve } from "bun";

const app = new Hono();
const port = 5180;

app.use("/api/*", cors());

app.get("/api/search", async (c) => {
  try {
    const queryParams = c.req.query();
    const { provider, query } = queryParams;

    const providerIds = provider.split(",");
    const providerInstances = allProviders.filter((p) => providerIds.includes(p.id));

    console.log("providerInstances", providerInstances);
    console.log("providerIds", providerIds);

    if (providerInstances.length !== providerIds.length) {
      return c.json({ error: "Provider not found" }, 404);
    }

    const errors: Error[] = [];
    const results: BaseResult[] = [];
    for (const providerInstance of providerInstances) {
      try {
        const results2 = await search(providerInstance, {
          query,
        });
        results.push(...results2);
      } catch (e) {
        if (providerInstances.length === 1) {
          throw e;
        }

        console.error(e);
        errors.push(e);
      }
    }

    return c.json({
      error: errors.length > 0 ? errors.map((e) => e.message).join("\n") : null,
      data: rankItems(query, results),
    });
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      return c.json({ error: e.message }, 500);
    }
    return c.status(500);
  }
});

app.get("/api/providers", async (c) => {
  const data = allProviders.map((provider) => {
    const { name, id, action, category, baseUrl, notice } = provider;
    return {
      name,
      id,
      action,
      category,
      baseUrl,
      notice,
    } as ProviderInfo;
  });

  return c.json(data);
});

/* serve entire dist folder as static */
app.use(
  "/*",
  serveStatic({
    root: "./dist",
    getContent: async (path) => {
      try {
        const file = Bun.file(path);
        const content = await file.arrayBuffer();
        return new Response(content, {
          headers: {
            "Content-Type": file.type,
          },
        });
      } catch (e) {
        return new Response(null, {
          status: 404,
        });
      }
    },
  })
);

console.log(`Listening on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
