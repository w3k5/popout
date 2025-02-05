import { BroadcastEvent, useBroadcastChannel } from "./use-broadcast-chanel";
import { usePopoutStore } from "./use-popout-store";

export enum PopoutActions {
	CLOSE_ALL = "CLOSE_ALL",
	CLOSE_TARGET = "CLOSE_TARGET",
}

interface PopoutBroadcastEvent extends BroadcastEvent {
	target?: string;
	type: PopoutActions;
}

export const usePopoutEvent = () => {
	const chanel = usePopoutStore((state) => state.chanel);
	useBroadcastChannel<PopoutBroadcastEvent>(chanel, {
		onMessage: (event) => {
			switch (event.data.type) {
				case PopoutActions.CLOSE_ALL: {
					window.close();
					break;
				}
				case PopoutActions.CLOSE_TARGET: {
					if (!event.data.target) {
						throw new Error("Попытка закрыть конкретное окно без передачи таргета");
					}
					console.log(event.data.target, window.name);
					if (event.data.target === window.name) {
						window.close();
					}
				}
			}
		},
	});
};
