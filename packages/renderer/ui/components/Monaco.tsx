/* eslint-disable header/header */

/**
 *
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
 *
 * The Below is taken directly from <https://npmjs.com/package/@uwu/monaco-react> as we cannot bundle it as a dependency.
 * BSD 3-Clause License
 *
 * Copyright (c) 2022 Cain Atkinson All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the author nor the names of its contributors may
 * be used to endorse or promote products derived from this software
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

import { React } from "~/renderer/api/webpack/common";
import { LazyComponent } from "~/renderer/util/react";

import type { Monaco } from "@monaco-editor/loader";
import loader from "@monaco-editor/loader";
import { editor } from "monaco-editor";

import "./monaco.scss";

type CfgOpts = Omit<editor.IStandaloneEditorConstructionOptions, "language" | "value" | "readOnly" | "theme">;

type CompProps = {
    lang: string;
    value: string;
    valOut?: (v: string) => void;
    readonly?: boolean;
    theme?: string;
    otherCfg?: CfgOpts;
    height?: string;
    width?: string;
    noCDN?: Monaco;
};

type IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

let monaco: Monaco;
let monacoLoaded: Promise<void>;

const loadedThemes = new Set<string>();

async function addThemeIfNeeded(t: string) {
    if (!t || !t.trim() || loadedThemes.has(t)) return;

    loadedThemes.add(t);

    const u = `https://cdn.esm.sh/monaco-themes@0.4.2/themes/${t}.json`;

    const theme = await fetch(u).then((r) => r.json());

    monaco.editor.defineTheme(t, theme);
}

async function initMonacoIfNeeded(useNpmMonaco?: Monaco) {
    if (monaco) return;

    if (useNpmMonaco) loader.config({ monaco: useNpmMonaco });

    if (!monacoLoaded)
        monacoLoaded = loader.init().then(async (m) => {
            monaco = m;

            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                target: monaco.languages.typescript.ScriptTarget.Latest,
                allowNonTsExtensions: true,
                moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                module: monaco.languages.typescript.ModuleKind.CommonJS,
                noEmit: true,
                esModuleInterop: true,
                jsx: monaco.languages.typescript.JsxEmit.React,
                reactNamespace: "React",
                allowJs: true,
                typeRoots: ["node_modules/@types"],
            });

            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: false,
                noSyntaxValidation: false,
            });

            const reactTypes = await (await fetch("https://cdn.jsdelivr.net/npm/@types/react/index")).text();

            monaco.languages.typescript.typescriptDefaults.addExtraLib(
                reactTypes,
                "file:///node_modules/@react/types/index.d.ts"
            );

            monaco.languages.typescript.javascriptDefaults.addExtraLib(
                reactTypes,
                "file:///node_modules/@react/types/index.d.ts"
            );
        });

    await monacoLoaded;
}

// every part of this mess is necessary
// yes, even the mutex and preserving the node children
// react is a truly painful beast :(
// -- sink

export default LazyComponent(
    () =>
        class extends React.PureComponent<CompProps> {
            ref = React.createRef<HTMLDivElement>();
            ed: IStandaloneCodeEditor;
            elems: Element[];
            // 0 = uninited
            // 1 = mutex initing
            // 2 = inited, no need for mutex
            initState = 0;

            async initMonaco() {
                await initMonacoIfNeeded(this.props.noCDN);

                await addThemeIfNeeded(this.props.theme);

                this.initState = 2;

                this.ed = monaco.editor.create(this.ref.current, {
                    language: this.props.lang,
                    value: this.props.value,
                    readOnly: this.props.readonly ?? false,
                    theme: this.props.theme,
                    ...this.props.otherCfg,
                });

                this.ed.onDidChangeModelContent(() => this.props.valOut?.(this.ed.getValue()));
            }

            componentDidMount() {
                if (this.initState !== 1)
                    // noinspection JSIgnoredPromiseFromCall
                    this.initMonaco();
                this.initState = 1;

                if (this.elems && this.initState !== 2) {
                    this.ref.current.innerHTML = "";
                    this.ref.current.append(...this.elems);
                }
            }

            componentWillUnmount() {
                if (this.initState !== 2) this.elems = Array.from(this.ref.current.children);
                else this.ed?.dispose();
            }

            componentDidUpdate(prevProps: Readonly<CompProps>) {
                if (this.initState !== 2) return;

                if (this.props.readonly !== prevProps.readonly)
                    this.ed.updateOptions({ readOnly: this.props.readonly });

                if (this.props.value !== this.ed.getValue()) this.ed.setValue(this.props.value);

                if (this.props.theme !== prevProps.theme)
                    addThemeIfNeeded(this.props.theme).then(() => this.ed.updateOptions({ theme: this.props.theme }));

                if (this.props.lang !== prevProps.lang) {
                    const model = this.ed.getModel();
                    if (model) {
                        monaco.editor.setModelLanguage(model, this.props.lang);
                        this.ed.setModel(model);
                    }
                }

                if (this.props.otherCfg !== prevProps.otherCfg && this.props.otherCfg)
                    this.ed.updateOptions(this.props.otherCfg);
            }

            render() {
                return (
                    <div
                        ref={this.ref}
                        style={{
                            width: this.props.width ?? "30rem",
                            height: this.props.height ?? "10rem",
                        }}
                    >
                        <div className="monaco-loading">
                            <div className="monaco-loading-background"></div>
                            <div className="monaco-loading-text">Monaco is currently loading, please wait...</div>
                        </div>
                    </div>
                );
            }
        }
);
