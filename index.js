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

app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

console.log("🦊 Oak is running (Deno Deploy)");
Deno.serve(app.fetch);
