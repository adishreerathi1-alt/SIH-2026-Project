import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("employee", "routes/employee.tsx"),
  route("tac-sync", "routes/tac-sync.tsx"),
  route("predictive", "routes/predictive.tsx"),
  route("wellness", "routes/wellness.tsx"),
  route("squad", "routes/squad.tsx"),
  route("debrief", "routes/debrief.tsx"),
] satisfies RouteConfig;
