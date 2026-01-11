import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("generate-ics", "routes/generate-ics.ts"),
] satisfies RouteConfig;
