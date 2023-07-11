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

import { IconProps, makeSvg } from "./base";

export default (props: IconProps) => {
    return makeSvg(
        [
            "M21.4319 21.1098C19.3401 19.7799 17.5593 18.0272 16.2075 15.9678C14.8557 13.9084 13.9638 11.5895 13.5911 9.16477L12.3366 0.720848C12.311 0.520662 12.2117 0.336692 12.0575 0.203827C11.9034 0.0709621 11.7051 -0.00155639 11.5002 2.53393e-05C11.2954 -0.00155639 11.0971 0.0709621 10.9429 0.203827C10.7888 0.336692 10.6895 0.520662 10.6639 0.720848L9.30486 9.16477C8.9519 11.5956 8.06815 13.9223 6.71457 15.9844C5.36098 18.0465 3.56973 19.7952 1.46411 21.1098L0.314098 21.8307C0.211503 21.9209 0.130281 22.0322 0.0760932 22.1568C0.0219055 22.2813 -0.00391655 22.4161 0.000480577 22.5515C-0.00393532 22.6721 0.0224444 22.7919 0.0772418 22.8998C0.132039 23.0078 0.213487 23.1004 0.314098 23.1693L1.46411 23.8902C3.57262 25.2261 5.36427 26.9937 6.71725 29.0726C8.07022 31.1516 8.95279 33.4932 9.30486 35.9382L10.6639 44.2792C10.6895 44.4793 10.7888 44.6633 10.9429 44.7962C11.0971 44.929 11.2954 45.0016 11.5002 45C11.7051 45.0016 11.9034 44.929 12.0575 44.7962C12.2117 44.6633 12.311 44.4793 12.3366 44.2792L13.5911 35.9382C13.9627 33.4993 14.8532 31.1652 16.2044 29.0889C17.5557 27.0127 19.3371 25.241 21.4319 23.8902L22.5818 23.1693C22.6957 23.1058 22.793 23.0168 22.8656 22.9095C22.9383 22.8021 22.9843 22.6795 23 22.5515C22.9849 22.4093 22.9399 22.2718 22.8679 22.1477C22.7959 22.0236 22.6985 21.9156 22.5818 21.8307L21.4319 21.1098Z",
        ],
        "0 0 23 45",
        props.size || 16,
        props.fill,
        props.stroke
    );
};
