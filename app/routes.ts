import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/language-redirect.tsx"),

  // Client content
  route("/:lang", "routes/home.tsx"),

  // Admin dashboard
  route("/:lang/admin", "routes/admin.tsx"),
] satisfies RouteConfig;
