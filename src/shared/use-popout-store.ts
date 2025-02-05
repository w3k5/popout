import chalk from "chalk";
import { devtools, persist } from "zustand/middleware";
import { create } from "zustand/react";

import { PopoutActions } from "./use-popout-event";

export const BROADCAST_POPOUT_KEY = "BROADCAST_POPOUT_KEY";

interface PopoutStore {
	addPopout: (id: string) => void;
	channel: string;
	clearPopouts: () => void;
	init: (initialChannelName: string) => void;
	popouts: string[];
	removePopout: (id: string) => void;
}

export const usePopoutStore = create<PopoutStore>()(
	devtools(
		persist(
			(set) => ({
				addPopout: (id) => set((state) => ({ popouts: [...state.popouts, id] })),
				channel: BROADCAST_POPOUT_KEY,
				clearPopouts: () => set({ popouts: [] }),
				init: (initialChannelName) => {
					set((state) => {
						console.log("initial channel", initialChannelName);
						return { ...state, channel: initialChannelName };
					});
				},
				popouts: [],
				removePopout: (id) => set((state) => ({ popouts: state.popouts.filter((popoutId) => popoutId !== id) })),
			}),
			{ name: "popouts" },
		),
	),
);

export const usePopout = () => {
	const popouts = usePopoutStore((state) => state.popouts);
	const addPopout = usePopoutStore((state) => state.addPopout);
	const clearPopouts = usePopoutStore((state) => state.clearPopouts);
	const removePopout = usePopoutStore((state) => state.removePopout);
	const init = usePopoutStore((state) => state.init);

	const openPopout = ({ channel, target }: { channel: string; target: string }) => {
		console.log(chalk.blue(`Попытка открытия нового окна для канала ${channel}`));
		const url = `${location.origin}${target}?channel=${channel}`;
		console.log(chalk.blue(`Таргет нового окна ${url}`));

		// Балования
		const gap = popouts.length * 25;
		const initialLeft = 100;
		const initialTop = 100;
		const left = initialLeft + gap;
		const top = initialTop + gap;
		// =========

		const newWindow = window.open(
			url,
			target,
			`scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${900},height=${300},left=${left},top=${top}`,
		);

		if (newWindow) {
			addPopout(target);
		}
	};

	const closeAll = ({ channel, shouldCloseCurrent = false }: { channel: string; shouldCloseCurrent?: boolean }) => {
		console.log(chalk.blue(`Попытка закрыть все окна канала ${channel}`));
		const broadcastChannel = new BroadcastChannel(channel);

		broadcastChannel.postMessage({ type: PopoutActions.CLOSE_ALL });
		broadcastChannel.close();
		clearPopouts();
		if (shouldCloseCurrent) {
			console.log(chalk.blue(`Попытка закрыть текущее окно во время закрытия всех окон`));
			window.close();
		}
	};

	const closeTarget = (channel: string, target: string) => {
		console.log(chalk.blue(`Попытка закрытия окна ${target} канала ${channel}`));
		const broadcastChannel = new BroadcastChannel(channel);

		broadcastChannel.postMessage({ target, type: PopoutActions.CLOSE_TARGET });
		removePopout(target);
		broadcastChannel.close();
	};

	const focusPopout = (target: string) => {
		const focusedWindow = window.open(
			"",
			target,
			`scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=900,height=300,left=600,top=600`,
		);

		if (focusedWindow) {
			focusedWindow.focus();
		} else {
			console.error(`Окно с именем ${target} не найдено.`);
		}
	};

	return {
		closeAll,
		closeTarget,
		focusPopout,
		init,
		openPopout,
		popouts,
	};
};
