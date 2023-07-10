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

const fs = window.aeroNative.fileSystem;

import { useSnippets } from "~/renderer/api/settings/useSettings";
import { OPEN_SNIPPET_DIRECTORY, OPEN_FILE } from "~/common/ipc";
import { isScript, reapply } from "~/renderer/api/snippets";
import { React } from "~/renderer/api/webpack/common";

import EmptyState, { WUMPUS_GAMING } from "../../components/EmptyState";
import { Folder, Play, File } from "../../components/Icons";
import PanelButton from "../../components/PanelButton";
import FormTitle from "../../components/FormTitle";
import Monaco from "../../components/Monaco";

import "./snippets.scss";

const getLang = (file: string, content: string) => {
    const ext = fs.path.extname(file).replace(".", "");

    switch (ext) {
        case "css":
            return "css";
        case "scss":
            return "scss";
        case "tsx":
        case "ts":
            return "typescript";
        case "jsx":
        case "js":
            if (content.startsWith("// @ts-check")) return "typescript";

            return "javascript";
    }
};

export default () => {
    const [snippets] = useSnippets();
    const [section, setSection] = React.useState<string>(snippets()._files[0]);

    return (
        <div id="aero-snippets">
            <FormTitle level={1}>Snippets</FormTitle>
            <div className="tab-bar" role="tablist" aria-orientation="horizontal">
                <div className="tab-bar-options">
                    {(snippets()._files as unknown as string[]).map((snippet) => (
                        <div
                            className={`tab ${section === snippet ? "active" : ""}`}
                            onClick={() => setSection(snippet)}
                        >
                            {snippet}
                        </div>
                    ))}
                </div>
                <div className="tab-bar-menu">
                    <PanelButton
                        tooltipText="Open Snippet Directory"
                        onClick={() => {
                            window.aeroNative.ipc.invoke(OPEN_SNIPPET_DIRECTORY);
                        }}
                    >
                        <Folder />
                    </PanelButton>
                </div>
            </div>
            <div className="aero-snippets-container">
                {snippets()._files.length ? (
                    <>
                        <div className="monaco-header">
                            <div className="monaco-header-lang">{fs.path.extname(section)}</div>
                            {isScript(section) && (
                                <PanelButton
                                    tooltipText="Run"
                                    onClick={() => {
                                        reapply(section);
                                    }}
                                >
                                    <Play />
                                </PanelButton>
                            )}
                            <PanelButton
                                tooltipText="Open File"
                                onClick={() => {
                                    window.aeroNative.ipc.invoke(OPEN_FILE, `/snippets/${section}`);
                                }}
                            >
                                <File size={12} />
                            </PanelButton>
                        </div>
                        <Monaco
                            height="100%"
                            width="100%"
                            theme="vs-dark"
                            lang={getLang(section, snippets()[section])}
                            value={snippets()[section] || `// ${section} snippet not found. Please create it.`}
                            valOut={(val) => {
                                snippets()[section] = val;
                            }}
                        />
                    </>
                ) : (
                    <EmptyState
                        title="No Snippets Yet? (つ｡◕‿‿◕｡)つ"
                        description="Create a snippet and reload to get started!"
                        image={WUMPUS_GAMING.dark}
                    />
                )}
            </div>
        </div>
    );
};
