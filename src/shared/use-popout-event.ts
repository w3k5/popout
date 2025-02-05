import chalk from "chalk";

import { BroadcastEvent, useBroadcastChannel } from "./use-broadcast-channel";

export enum PopoutActions {
	CLOSE_ALL = "popout:close_all",
	CLOSE_TARGET = "popout:close_target",
	SELF_CLOSE_POPOUT = "popout:self_close",
}

interface PopoutBroadcastEvent extends BroadcastEvent {
	target?: string;
	type: PopoutActions;
}

export const usePopoutEvent = (channel: string) => {
	useBroadcastChannel<PopoutBroadcastEvent>(channel, {
		onMessage: (event) => {
			console.log(chalk.green("Событие", event.data.type));
			switch (event.data.type) {
				case PopoutActions.CLOSE_ALL: {
					window.close();
					break;
				}
				case PopoutActions.CLOSE_TARGET: {
					if (!event.data.target) {
						throw new Error("Попытка закрыть конкретное окно без передачи таргета");
					}
					if (event.data.target === window.name) {
						window.close();
					}
					break;
				}
				default: {
					console.log("Неизвестное событие", event);
				}
			}
		},
	});
};
