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

import https from "node:https";

const httpOptions = {
    headers: {
        "User-Agent": "Aero (https://github.com/aero-mod/aero)",
    },
};

export const get = (url: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        https
            .get(url, httpOptions, (res) => {
                if (res.statusCode > 399) return reject(res.statusMessage);

                const chunks: Buffer[] = [];

                res.on("error", reject);
                res.on("data", (chunk) => chunks.push(chunk));
                res.on("end", () => resolve(Buffer.concat(chunks)));
            })
            .on("error", reject);
    });
};
