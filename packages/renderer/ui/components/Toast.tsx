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

import { ReactDOM, React, ReactSpring } from "~/renderer/api/webpack/common";
import { LazyComponent } from "~/renderer/util/react";
import markdown from "~/renderer/util/markdown";
import { body } from "~/renderer/api/dom";

import "./toast.scss";

export type ToastProps = {
    id?: number;
    title: string;
    color: string;
    children: React.ReactNode | string;
};

export const registry = new Map<number, React.Dispatch<React.SetStateAction<boolean>>>();

const Toast = LazyComponent(() => (props: ToastProps) => {
    const [closing, setClosing] = React.useState(false);

    registry.set(props.id || 0, setClosing);

    const ref = React.useRef<HTMLDivElement>(null);

    const t = ReactSpring.useTransition(!closing, {
        from: { translateY: -15, opacity: 0, height: 0, marginTop: 0 },
        enter: () => async (next) => {
            await next({
                translateY: 0,
                opacity: 1,
                height: ref.current ? ref.current.clientHeight : 0,
                marginTop: 10,
            });
        },
        leave: { translateY: -15, opacity: 0, height: 0, marginTop: 0 },
        config: {
            mass: 1,
            tension: 185,
            friction: 26,
        },
    });

    return t((style, item) => {
        return (
            item && (
                <ReactSpring.animated.div className="toast-container" style={style}>
                    <div
                        className="toast"
                        ref={ref}
                        onClick={() => {
                            window.aero.notifications.removeToast(props.id || 0);
                        }}
                        style={{
                            // @ts-expect-error Yes i know
                            "--color": props.color,
                        }}
                    >
                        <div className="toast-color"></div>
                        <div className="toast-details">
                            <div className="toast-title">{props.title}</div>
                            <div className="toast-content">
                                {typeof props.children === "string" ? markdown(props.children, true) : props.children}
                            </div>
                        </div>
                    </div>
                </ReactSpring.animated.div>
            )
        );
    });
});

export let toastSetter: React.Dispatch<React.SetStateAction<ToastProps[]>> | null = null;

export const Layer = () => {
    const [toasts, setToasts] = React.useState<ToastProps[]>([]);

    toastSetter = setToasts;

    return (
        <div id="toast-layer">
            {toasts.map((item) => (
                <Toast {...item} />
            ))}
        </div>
    );
};

export const initialise = () => {
    setImmediate(() => ReactDOM.render(<Layer />, body));
};

export default Toast;
