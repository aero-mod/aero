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

import type { ReactNode } from "react";

import { c } from "~/renderer/util/classes";

export { default as ModalCloseButton } from "./CloseButton";

import "./index.scss";

export enum ModalSize {
    Small = "small",
    Medium = "medium",
    Large = "large",
    Dynamic = "dynamic",
}

type ModalRootProps = {
    size: ModalSize;
    children: ReactNode;
    rest: {
        [x: string]: unknown;
    };
};

export const ModalRoot = (props: ModalRootProps) => {
    const e = {
        transitionState: props.rest.transitionState,
    };

    return (
        <div {...e} className={c("modal-root", `size-${props.size}`)}>
            {props.children}
        </div>
    );
};

export const ModalHeader = (props: {
    children: JSX.Element | JSX.Element[];
    center?: boolean;
    separator?: boolean;
}) => {
    return (
        <div
            className={c("modal-header", {
                center: props.center,
                separator: props.separator,
            })}
        >
            {props.children}
        </div>
    );
};

export const ModalContent = (props: { className?: string; children: JSX.Element | JSX.Element[] | ReactNode }) => {
    return <div className={c("modal-content", props.className)}>{props.children}</div>;
};

export const ModalFooter = (props: {
    transparent?: boolean;
    center?: boolean;
    gap?: boolean;
    children: JSX.Element | JSX.Element[];
}) => {
    return (
        <div
            className={c("modal-footer", {
                transparent: props.transparent,
                center: props.center,
                gap: props.gap,
            })}
        >
            {props.children}
        </div>
    );
};
