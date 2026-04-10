import { Application, Status } from "@oak/oak";

import { corsHeaders } from "./config.js";
import mainRouter from "./routes/index.js";

const app = new Application();

app.use(async (ctx, next) => {
  console.log(`[REQ] ${ctx.request.method} ${ctx.request.url.pathname}`);
  await next();
  console.log(`[RES] ${ctx.response.status} ${ctx.request.method} ${ctx.request.url.pathname}`);
});

// Global CORS
app.use(async (ctx, next) => {
  for (const corsHeaderKey of Object.keys(corsHeaders)) {
    ctx.response.headers.set(corsHeaderKey, corsHeaders[corsHeaderKey]);
  }

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = Status.NoContent;
    return;
  }

  await next();
});

app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, HEAD, OPTIONS");
  ctx.response.headers.set("Access-Control-Allow-Headers", "*");
  ctx.response.headers.set("Access-Control-Max-Age", "86400");

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }

  await next();
});

app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

console.log("🦊 Oak is running (Deno Deploy)");
Deno.serve(app.fetch);
