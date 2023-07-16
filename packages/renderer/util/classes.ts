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

export const Margin = {
    Top: {
        1: "mt-1",
        2: "mt-2",
        3: "mt-3",
        4: "mt-4",
    },
    Bottom: {
        1: "mb-1",
        2: "mb-2",
        3: "mb-3",
        4: "mb-4",
    },
    Left: {
        1: "ml-1",
        2: "ml-2",
        3: "ml-3",
        4: "ml-4",
    },
    Right: {
        1: "mr-1",
        2: "mr-2",
        3: "mr-3",
        4: "mr-4",
    },
};

export const c = (...names: (string | string[] | Record<string, boolean>)[]): string => {
    const classNames = new Set<string>();

    for (const name of names) {
        switch (typeof name) {
            case "string":
                classNames.add(name);
                break;
            case "object":
                if (Array.isArray(name)) {
                    name.forEach((n) => classNames.add(n));
                } else {
                    for (const [key, value] of Object.entries(name)) {
                        if (value) classNames.add(key);
                    }
                }
                break;
        }
    }

    return [...classNames].join(" ");
};
