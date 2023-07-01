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

export function makeLazy<T>(factory: () => T): () => T {
    let cache: T;
    return () => cache ?? (cache = factory());
}

export function LazyComponent<T extends object = object>(factory: () => React.ComponentType<T>) {
    const get = makeLazy(factory);

    return (props: T) => {
        const Component = get();

        return <Component {...props} />;
    };
}
