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

import { ModalRoot, ModalHeader, ModalFooter, ModalContent, ModalSize } from "~/renderer/ui/components/Modal";
import { ButtonColor, ButtonLook, ButtonSize } from "~/renderer/ui/components/Button";
import FormTitle from "~/renderer/ui/components/FormTitle";
import { Button } from "~/renderer/ui/components";
import markdown from "~/renderer/util/markdown";

export default (props: {
    content: string;
    title: string;
    danger?: boolean;
    confirmText?: string;
    cancelText?: string;
    modalSize?: ModalSize;
    onConfirm?: () => void;
    onCancel?: () => void;
    rest: {
        onClose: () => void;
        [key: string]: unknown;
    };
}) => (
    <ModalRoot size={props.modalSize || ModalSize.Medium} rest={props.rest}>
        <ModalHeader>
            <FormTitle nomargin level={1}>
                {props.title}
            </FormTitle>
        </ModalHeader>
        <ModalContent>{markdown(props.content)}</ModalContent>
        <ModalFooter>
            <Button
                color={props.danger ? ButtonColor.RED : ButtonColor.BRAND}
                size={ButtonSize.MEDIUM}
                onClick={() => {
                    props.onConfirm?.();

                    props.rest.onClose();
                }}
            >
                {props.confirmText || "Confirm"}
            </Button>
            <Button
                color={ButtonColor.PRIMARY}
                look={ButtonLook.LINK}
                size={ButtonSize.MEDIUM}
                onClick={() => {
                    props.onCancel?.();

                    props.rest.onClose();
                }}
            >
                {props.cancelText || "Cancel"}
            </Button>
        </ModalFooter>
    </ModalRoot>
);
