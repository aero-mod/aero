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

/**
 * Taken from https://npmjs.com/package/unzip-crx-3 but only included part for bundle reasons
 * All credit goes to the original author(s) of the package
 *
 * https://github.com/peerigon/unzip-crx
 */
export default (buf) => {
    function calcLength(a, b, c, d) {
        let length = 0;

        length += a << 0;
        length += b << 8;
        length += c << 16;
        length += (d << 24) >>> 0;
        return length;
    }

    // 50 4b 03 04
    // This is actually a zip file
    if (buf[0] === 80 && buf[1] === 75 && buf[2] === 3 && buf[3] === 4) {
        return buf;
    }

    // 43 72 32 34 (Cr24)
    if (buf[0] !== 67 || buf[1] !== 114 || buf[2] !== 50 || buf[3] !== 52) {
        throw new Error("Invalid header: Does not start with Cr24");
    }

    // 02 00 00 00
    // or
    // 03 00 00 00
    const isV3 = buf[4] === 3;
    const isV2 = buf[4] === 2;

    if ((!isV2 && !isV3) || buf[5] || buf[6] || buf[7]) {
        throw new Error("Unexpected crx format version number.");
    }

    if (isV2) {
        const publicKeyLength = calcLength(buf[8], buf[9], buf[10], buf[11]);
        const signatureLength = calcLength(buf[12], buf[13], buf[14], buf[15]);

        // 16 = Magic number (4), CRX format version (4), lengths (2x4)
        const zipStartOffset = 16 + publicKeyLength + signatureLength;

        return buf.slice(zipStartOffset, buf.length);
    }
    // v3 format has header size and then header
    const headerSize = calcLength(buf[8], buf[9], buf[10], buf[11]);
    const zipStartOffset = 12 + headerSize;

    return buf.slice(zipStartOffset, buf.length);
};
