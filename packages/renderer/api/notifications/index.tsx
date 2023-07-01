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

import { _MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "../webpack/common/components";
import { ModalSize, ModalRoot } from "~/renderer/ui/components/Modal";
import Generic from "./Generic";

// TODO: Remove this and use custom components
export const showReloadDialog = () => {
    _MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.openModal((props: { onClose: () => void; [key: string]: unknown }) => (
        <_MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.Dialog
            className="focus-lock"
            role="dialog"
            aria-labelledby=":re:"
        >
            <Generic
                title="Reload required"
                content={
                    "A plugin or setting you just enabled requires a reload to take effect.\nWould you like to reload now or do it yourself later?"
                }
                onConfirm={() => {
                    window.location.reload();
                }}
                confirmText="Reload"
                cancelText="Later"
                modalSize={ModalSize.Small}
                danger
                rest={props}
            />
        </_MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.Dialog>
    ));
};

export const showGeneric = (children: (onClose: () => void) => React.ReactNode, size?: ModalSize) => {
    _MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.openModal((props: { onClose: () => void; [key: string]: unknown }) => (
        <_MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.Dialog
            className="focus-lock"
            role="dialog"
            aria-labelledby=":re:"
        >
            <ModalRoot rest={props} size={size || ModalSize.Medium}>
                {children(props.onClose)}
            </ModalRoot>
        </_MEGA_MODULE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.Dialog>
    ));
};
