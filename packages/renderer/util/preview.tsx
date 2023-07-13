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

import { showModal } from "../api/notifications";
import { getModule } from "../api/webpack";
import markdown from "./markdown";
import { sleep } from "./time";

import { ModalSize, ModalContent, ModalFooter, ModalHeader } from "../ui/components/Modal";
import Button, { ButtonColor, ButtonSize } from "../ui/components/Button";
import FormTitle from "../ui/components/FormTitle";

export default async () => {
    await sleep(10000);

    if (window.aeroNative.channel === "preview")
        showModal(
            (close) => (
                <>
                    <ModalHeader center>
                        <FormTitle noMargin level={1}>
                            Aero Preview Build
                        </FormTitle>
                    </ModalHeader>
                    <ModalContent className={getModule(["markup"]).markup}>
                        {markdown(
                            `
You are using a distributed preview build of Aero. **Do not:**

- Distribute this build.
- Share screenshots of this build.
- Share any information about this build *except* to Aero core team members.

To continue using this build, press the button below. If you do not agree to these terms, please close this window and install the stable build of Aero.
`.trim(),
                            false,
                            {
                                allowList: true,
                            }
                        )}
                    </ModalContent>
                    <ModalFooter>
                        <Button fullwidth size={ButtonSize.LARGE} color={ButtonColor.RED} onClick={close}>
                            I Understand
                        </Button>
                    </ModalFooter>
                </>
            ),
            ModalSize.Small
        );
};
