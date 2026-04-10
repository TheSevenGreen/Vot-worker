import { Application, Status } from "@oak/oak";

import { corsHeaders } from "./config.js";
import mainRouter from "./routes/index.js";

const app = new Application();

app.use(async (ctx, next) => {
  console.log(`[REQ] ${ctx.request.method} ${ctx.request.url.href}`);
  await next();
  console.log(`[RES] ${ctx.response.status} ${ctx.request.method} ${ctx.request.url.pathname}`);
});

app.use(async (ctx, next) => {
  const applyCors = () => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, HEAD, OPTIONS");
    ctx.response.headers.set("Access-Control-Allow-Headers", "*");
    ctx.response.headers.set("Access-Control-Max-Age", "86400");

    for (const corsHeaderKey of Object.keys(corsHeaders)) {
      ctx.response.headers.set(corsHeaderKey, corsHeaders[corsHeaderKey]);
    }
  };

  applyCors();

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = Status.NoContent;
    applyCors();
    return;
  }

  await next();
  applyCors();
});

app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

app.addEventListener("error", (evt) => {
  console.error("[oak app error]", evt.error);
});

console.log("🦊 Oak is running (Deno Deploy)");
Deno.serve(app.fetch);
