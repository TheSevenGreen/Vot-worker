import { errorResponse } from "./responses.js";

async function validateJSONRequest(ctx, toU8Array = true) {
  const contentType = ctx.request.headers.get("Content-Type");

  if (!contentType || !contentType.includes("application/json")) {
    errorResponse(ctx, "error-content");
    return [null, null];
  }

  let requestInfo;
  try {
    requestInfo = await ctx.request.body.json();
  } catch (error) {
    console.error("Failed to parse JSON body:", error);
    errorResponse(ctx, "error-request");
    return [null, null];
  }

  if (!requestInfo || typeof requestInfo !== "object") {
    errorResponse(ctx, "error-request");
    return [null, null];
  }

  let yandexBody = requestInfo.body;
  const yandexHeaders = requestInfo.headers;

  console.log("requestInfo:", requestInfo);
  console.log("request headers:", yandexHeaders);
  console.log("request body:", yandexBody);

  if (yandexBody === undefined && yandexHeaders === undefined) {
    errorResponse(ctx, "error-request");
    return [null, null];
  }

  if (!toU8Array) {
    return [yandexBody, yandexHeaders];
  }

  if (yandexBody == null) {
    return [yandexBody, yandexHeaders];
  }

  try {
    yandexBody = new Uint8Array(yandexBody);
  } catch (error) {
    console.error("Failed to convert body to Uint8Array:", error);
    errorResponse(ctx, "error-request");
    return [null, null];
  }

  return [yandexBody, yandexHeaders];
}

export { validateJSONRequest };
