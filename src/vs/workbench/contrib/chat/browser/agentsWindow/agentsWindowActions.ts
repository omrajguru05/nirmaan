/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Action2, registerAction2, MenuId } from '../../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IAgentsWindowService } from './agentsWindowService.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';

export class OpenAgentsWindowAction extends Action2 {
	static readonly ID = 'workbench.action.openAgentsWindow';

	constructor() {
		super({
			id: OpenAgentsWindowAction.ID,
			title: { value: 'Nirmaan: Open Agents', original: 'Nirmaan: Open Agents' },
			category: { value: 'Nirmaan', original: 'Nirmaan' },
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyA,
			},
			menu: [
				{
					id: MenuId.MenubarViewMenu,
					group: '1_open',
					order: 2
				}
			]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const agentsWindowService = accessor.get(IAgentsWindowService);
		await agentsWindowService.openAgentsWindow();
	}
}

registerAction2(OpenAgentsWindowAction);
