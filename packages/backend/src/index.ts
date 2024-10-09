import { ProviderExports, type ProviderInfo } from "shared/defs";
import search, { relevanceSortResults } from "./utils";
import allProviders from "./providers";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/serve-static";

import { serve } from "bun";

const app = new Hono();
const port = 5180;
const distFolderPath = "./dist";

const distFolder = Bun.file(distFolderPath);
const indexFile = Bun.file(`${distFolderPath}/index.html`);
if (!distFolder.exists() || !indexFile.exists()) {
  throw new Error(
    `"${distFolderPath}" folder or it's files were not found. Make sure you haven\'t moved the dist folder or the executable.`
  );
}

/* helper function to get results from instance */
async function getResults(
  providerInstance: ProviderExports,
  query: string,
  onError: (e: Error) => void
) {
  const resultsPromise = search(providerInstance, { query })
    .then((r) => {
      return r.map((e) => ({
        ...e,
        provider: providerInstance.id,
      }));
    })
    .catch((e) => {
      onError(e);
      return [];
    });

  return await resultsPromise;
}

app.use("/api/*", cors());

app.get("/api/search", async (c) => {
  try {
    const queryParams = c.req.query();
    const { provider, query } = queryParams;

    if (!query || !provider) {
      return c.status(400);
    }

    const providerIds = provider.split(",");
    const providerInstances = allProviders.filter((p) => providerIds.includes(p.id));

    if (providerInstances.length !== providerIds.length) {
      return c.json({ error: "Provider not found" }, 404);
    }

    const errors: Error[] = [];

    const searchPromises = providerInstances.map((pr) =>
      getResults(pr, query, errors.push)
    );

    const unflattenedResults = (await Promise.all(searchPromises)).flat();
    const results = relevanceSortResults(query, unflattenedResults);
    console.log(results.length, "total results found");

    /* if theres only 1 provider, return the error */
    if (results.length === 0 && errors.length === providerInstances.length) {
      throw errors[0];
    }

    const errorsText = errors.length > 0 ? errors.map((e) => e.message).join("\n") : null;

    return c.json({
      error: errorsText,
      data: results,
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
    /* remove functions to fit ProviderInfo */
    return Object.entries(provider).reduce((acc, [key, value]) => {
      if (typeof value !== "function") {
        acc[key] = value;
      }
      return acc;
    }, {} as ProviderInfo);
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

console.log(`CTRL + click on the link below to open the app in your browser:`);
console.log("http://localhost:5180");
console.log("");
console.log("If you're running this app in development mode, click the link below:");
console.log("http://localhost:5173");

serve({
  fetch: app.fetch,
  port,
});
