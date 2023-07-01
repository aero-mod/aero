/* eslint-disable header/header */

import { defineConfig } from "rollup";

import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import scss from "rollup-plugin-scss";
import swc from "@rollup/plugin-swc";

import fs from "fs";

const isProduction = process.env.ROLLUP_WATCH !== "true";

export default defineConfig([
    {
        input: "packages/main/index.ts",
        output: {
            format: "cjs",
            file: "dist/main.js",
        },
        plugins: [
            nodeResolve({
                exportConditions: ["node"],
            }),
            typescript(),
            commonjs(),
            json(),
            isProduction && terser(),
        ].filter(Boolean),
        external: ["electron"],
    },
    {
        input: "packages/preload/index.ts",
        output: {
            format: "cjs",
            file: "dist/preload.js",
        },
        plugins: [
            nodeResolve({
                exportConditions: ["node"],
            }),
            typescript(),
            commonjs({
                ignoreDynamicRequires: true,
            }),
            json(),
            replace({
                preventAssignment: true,
                values: {
                    "process.env.AERO_CHANNEL": process.argv.includes("--preview")
                        ? JSON.stringify("preview")
                        : !isProduction
                        ? JSON.stringify("development")
                        : JSON.stringify("production"),
                },
            }),
            isProduction && terser(),
        ].filter(Boolean),
        external: ["electron"],
    },
    {
        input: "packages/renderer/index.ts",
        output: {
            format: "cjs",
            file: "dist/renderer.js",
        },
        plugins: [
            nodeResolve({
                exportConditions: ["node"],
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            }),
            scss({
                fileName: "renderer.css",
                outputStyle: "compressed",
            }),
            commonjs(),
            json(),
            swc(),
            {
                version: "0.0.1",
                name: "plugin-filecontent",
                resolveId(source) {
                    if (source.startsWith("~content/")) {
                        return source.replace("~content/", "_LOAD_CONTENT_/");
                    }
                },
                load(id) {
                    if (id.startsWith("_LOAD_CONTENT_/")) {
                        const file = fs.readFileSync(id.replace("_LOAD_CONTENT_/", ""), "utf-8");

                        return `export default ${JSON.stringify(file)}`;
                    }
                },
            },
            typescript(),
            isProduction && terser(),
        ].filter(Boolean),
        external: ["electron", "react"],
    },
]);
