import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { normalizePath, defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tailwindcss from "@tailwindcss/vite";

// @ts-ignore
// @ts-ignore
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        TanStackRouterVite(),
        viteStaticCopy({
            targets: [
                {
                    src: normalizePath(path.resolve("./src/assets/locales")),
                    dest: normalizePath(path.resolve("./dist")),
                },
            ],
        }),
    ],

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },

    server: {
        host: true,
        strictPort: true,
    },
});
