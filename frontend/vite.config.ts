import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

function copyMediapipeWasm(): Plugin {
  const copy = () => {
    const src = resolve("node_modules/@mediapipe/tasks-vision/wasm");
    const dest = resolve("public/mediapipe/wasm");
    if (!existsSync(src)) return;
    mkdirSync(dest, { recursive: true });
    cpSync(src, dest, { recursive: true });
  };
  return {
    name: "copy-mediapipe-wasm",
    buildStart() {
      copy();
    },
  };
}

export default defineConfig({
  plugins: [copyMediapipeWasm(), reactRouter(), tailwindcss()],
  server: {
    watch: {
      ignored: ["**/public/models/**", "**/*.task"],
    },
  },
  optimizeDeps: {
    include: ["@mediapipe/tasks-vision"],
  },
  ssr: {
    noExternal: [],
    external: ["@mediapipe/tasks-vision"],
  },
});
