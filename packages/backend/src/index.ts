import BaseResult, { type ProviderInfo } from "shared/defs";
import search, { relevanceSortResults } from "./utils";
import allProviders from "./providers";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/serve-static";

import { serve } from "bun";

const app = new Hono();
const port = 5180;
const distFolderPath = "./dist";

app.use("/api/*", cors());

app.get("/api/search", async (c) => {
  try {
    const queryParams = c.req.query();
    const { provider, query } = queryParams;

    const providerIds = provider.split(",");
    const providerInstances = allProviders.filter((p) => providerIds.includes(p.id));

    if (providerInstances.length !== providerIds.length) {
      return c.json({ error: "Provider not found" }, 404);
    }

    const errors: Error[] = [];

    const searchPromises = providerInstances.map(async (providerInstance) => {
      try {
        const results2 = await search(providerInstance, {
          query,
        });
        return results2;
      } catch (e) {
        console.error(e);
        errors.push(e);
        return [];
      }
    });

    const results = (await Promise.all(searchPromises)).flat();
    console.log(results.length, "total results found");

    /* if theres only 1 provider, return the error */
    if (results.length === 0 && errors.length === providerInstances.length) {
      throw errors[0];
    }

    return c.json({
      error: errors.length > 0 ? errors.map((e) => e.message).join("\n") : null,
      data: relevanceSortResults(query, results),
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
    root: distFolderPath,
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

const distFolder = Bun.file(distFolderPath);
if (!distFolder.exists()) {
  throw new Error(
    `"${distFolderPath}" folder not found. Make sure you haven\'t moved the dist folder or the executable.`
  );
}

console.log(`CTRL + click on the link below to open the app in your browser.`);
console.log(`http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
