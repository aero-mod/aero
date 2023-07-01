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

import logger from "~/common/logger";
import { Filters, waitFor } from "../webpack";

export let _MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
};

type ParentComponent<T> = (
    props: T & {
        children: JSX.Element | JSX.Element[] | ((props: { [x: string]: unknown }) => JSX.Element | JSX.Element[]);
    }
) => JSX.Element;

/**
 * A Fallback component used for components aero depends on.
 */
const Fallback =
    (id: string) =>
    (
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        props: Parameters<ParentComponent<any>>["0"]
    ) => {
        // to avoid circular dependency, use the window global
        window.aero.webpack.common.React.useEffect(() => {
            logger.warn(
                `Aero is using a fallback component instead of Discord's ${id} component. This is not recommended and may cause issues.`
            );
        }, []);

        return props.children;
    };

export let Tooltip:
    | undefined
    | ParentComponent<{
          text: string;
      }> = Fallback("Tooltip");

waitFor(
    Filters.byMangled((md) => {
        if (md["Colors"] && md["defaultProps"]) {
            return true;
        }

        return false;
    })
).then((md) => {
    Tooltip = md;
});

waitFor(["openModal", "Modal"]).then((md) => {
    _MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = md;
});
