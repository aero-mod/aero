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

export const head = document.createElement("aero-head");
export const body = document.createElement("aero-body");

export const themes = document.createElement("aero-themes");
export const styles = document.createElement("aero-styles");
export const snippets = document.createElement("aero-snippets");

head.append(themes, snippets, styles);

window.addEventListener("DOMContentLoaded", () => {
    document.head.append(head);
    document.body.append(body);
});

export const injectStyles = (id: string, css: string) => {
    const style = document.createElement("style");

    style.id = id;
    style.textContent = window.aeroNative.external.transpileCSS(css, `${id}.css`).outputText;

    styles.append(style);
};

export const removeStyles = (id: string) => {
    const style = document.getElementById(id);

    if (!style) return;

    style.remove();
};
