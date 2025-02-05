import { BroadcastEvent, useBroadcastChannel } from "./use-broadcast-channel";

export enum PopoutActions {
	CLOSE_ALL = "popout:close_all",
	CLOSE_TARGET = "popout:close_target",
}

type PopoutBroadcastEvent = PopoutCloseAllEvent | PopoutCloseTargetEvent;

interface PopoutCloseAllEvent extends BroadcastEvent {
	type: PopoutActions.CLOSE_ALL;
}

interface PopoutCloseTargetEvent extends BroadcastEvent {
	target: string;
	type: PopoutActions.CLOSE_TARGET;
}

export const usePopoutEvent = (
	channel: string,
	subscriptions?: {
		[PopoutActions.CLOSE_ALL]?: () => void;
		[PopoutActions.CLOSE_TARGET]?: (target: string) => void;
	},
) => {
	useBroadcastChannel<PopoutBroadcastEvent>(channel, {
		onMessage: (event) => {
			switch (event.data.type) {
				case PopoutActions.CLOSE_ALL: {
					subscriptions?.[event.data.type]?.();
					window.close();
					break;
				}
				case PopoutActions.CLOSE_TARGET: {
					if (!event.data.target) {
						throw new Error("Попытка закрыть конкретное окно без передачи таргета");
					}
					if (event.data.target === window.name) {
						subscriptions?.[event.data.type]?.(event.data.target);
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
