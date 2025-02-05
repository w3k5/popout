import { BroadcastEvent, useBroadcastChannel } from "./use-broadcast-channel";

export enum PopoutActions {
	CLOSE_ALL = "popout:close_all",
	CLOSE_TARGET = "popout:close_target",
	SELF_CLOSE_POPOUT = "self:close_target",
}

interface PopoutBroadcastEvent extends BroadcastEvent {
	target?: string;
	type: PopoutActions;
}

export const usePopoutEvent = (
	channel: string,
	subscriptions?: Partial<Record<PopoutActions, (target?: string) => void>>,
) => {
	useBroadcastChannel<PopoutBroadcastEvent>(channel, {
		onMessage: (event) => {
			console.log("event", event.data.type);
			subscriptions?.[event.data.type]?.(event.data.target);
			switch (event.data.type) {
				case PopoutActions.CLOSE_ALL: {
					window.close();
					break;
				}
				case PopoutActions.CLOSE_TARGET: {
					if (!event.data.target) {
						throw new Error("Попытка закрыть конкретное окно без передачи таргета");
					}
					console.log("event.data.target", event.data.target);
					console.log("window.name", window.name);
					if (event.data.target === window.name) {
						console.log("Вызов window close");
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
