/**
 * This file is part of Aero, a next-generation Discord mod empowering users and developers alike.
 * Copyright (c) 2023 TheCommieAxolotl & contributors.
 *
 * Aero is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Aero is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Aero. If not, see <https://www.gnu.org/licenses/>.
 */

import { wrapJSLike } from "../plugins/external";
import { SourceMap } from "~/renderer/globals";
import { h, snippets } from "../dom";

const fs = window.aeroNative.fileSystem;

export const scripts = ["js", "jsx", "ts", "tsx"];
export const styles = ["css", "scss", "sass"];

export default () => {
    const snippetFiles = fs.readdir("/snippets");

    for (const snippet of snippetFiles) {
        const snippetPath = `/snippets/${snippet}`;

        if (fs.readFile(`/snippets/${snippet}`)) {
            const file = fs.readFile(snippetPath);

            const scriptOrStyle = scripts.some((ext) => snippetPath.endsWith(`.${ext}`))
                ? "script"
                : styles.some((ext) => snippetPath.endsWith(`.${ext}`))
                ? "style"
                : null;

            if (scriptOrStyle === "script") {
                if (!snippetPath.endsWith(".d.ts")) {
                    const { outputText } = window.aeroNative.external.transpile(file, snippetPath, {
                        module: 1, // CommonJS
                        target: 99, // ESNext
                        jsx: 2, // React
                        jsxFactory: "window.aero.webpack.common.React.createElement",
                        jsxFragmentFactory: "window.aero.webpack.common.React.Fragment",
                    });

                    wrapJSLike(snippetPath.split("/").pop(), outputText);
                }
            }

            if (scriptOrStyle === "style") {
                const { outputText, sourceMap } = window.aeroNative.external.transpileCSS(file, snippetPath);

                injectCSSSnippet(snippetPath.split("/").pop(), outputText, sourceMap);
            }
        }
    }
};

export const injectCSSSnippet = (fileName: string, code: string, sourceMap: SourceMap) => {
    const codeWithSource =
        code +
        `\n\n//# sourceURL=aero:snippet \n//# sourceMappingURL=data:application/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(sourceMap)
        )}`;

    const style = h("style", {
        id: `aero-s-${fileName.replace(/\W/g, "-")}`,
    });

    style.innerHTML = codeWithSource;

    snippets.appendChild(style);

    return style.id;
};
