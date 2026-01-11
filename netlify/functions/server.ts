import { createRequestHandler } from "@react-router/express";
import express from "express";
import serverless from "serverless-http";

const app = express();

app.use(
  createRequestHandler({
    // @ts-expect-error - virtual module provided by React Router at build time
    build: () => import("../../build/server/index.js"),
  })
);

export const handler = serverless(app);
