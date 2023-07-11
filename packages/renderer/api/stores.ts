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

import settings, { observeSettings } from "./settings";
import { React } from "./webpack/common";
import { Addon } from "./types";

class Store<
    T = {
        [key: string]: unknown;
    }
> {
    state: T | null;

    #listeners: Set<(value: T) => void> = new Set();

    constructor(setup: () => T) {
        this.state = setup();
    }

    emit() {
        this.#listeners.forEach((listener) => listener(this.state));
    }

    setState(newState: (prevState: T) => T) {
        const state = this.state;

        this.state = newState(state);

        this.emit();
    }

    addListener(listener: (value: T) => void) {
        this.#listeners.add(listener);
    }

    removeListener(listener: () => void) {
        this.#listeners.delete(listener);
    }
}

export const EnabledAddonStore = new Store<{
    themes: {
        [key: string]: boolean;
    };
    plugins: {
        [key: string]: boolean;
    };
}>(() => {
    const data = settings.enabledAddons;

    return data;
});

observeSettings((settings) => {
    EnabledAddonStore.setState((state) => ({
        ...state,
        ...settings.enabledAddons,
    }));
}, "enabledAddons");

export const useStore = <T>(store: Store<T>) => {
    const [, forceUpdate] = React.useState<unknown>();

    React.useEffect(() => {
        const listener = () => forceUpdate({});

        store.addListener(listener);

        return () => store.removeListener(listener);
    }, [store]);

    return store.state;
};
