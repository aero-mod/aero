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

import { LazyComponent } from "~/renderer/util/react";
import { React } from "~/renderer/api/webpack/common";
import logger from "~/common/logger";

import Button from "./Button";

import "./errorboundary.scss";

export default LazyComponent(
    () =>
        class ErrorBoundary extends React.PureComponent<React.PropsWithChildren> {
            state = {
                hasError: false,
                retries: 0,
                error: {
                    message: "",
                    stack: "",
                },
            };

            static getDerivedStateFromError(error: Error) {
                return {
                    hasError: true,
                    error: {
                        message: error.message,
                        stack: error.stack,
                    },
                };
            }

            render() {
                if (!this.state.hasError) return this.props.children;

                return (
                    <>
                        <div className="error-boundary">
                            <div className="heading">Oops! Something went wrong...</div>
                            <div className="error-boundary-text">
                                Something went wrong while trying to render this component. More information is below.
                            </div>
                            <div className="button-container">
                                <Button
                                    onClick={() => {
                                        this.setState({ hasError: false, retries: this.state.retries + 1 });
                                    }}
                                >
                                    Retry ({this.state.retries})
                                </Button>
                            </div>
                            <code>
                                <pre>{this.state.error.stack}</pre>
                            </code>
                        </div>
                    </>
                );
            }

            componentDidCatch(error: Error) {
                logger.error(error);
            }
        }
);
