import { nanoid } from "nanoid";
import { create } from "zustand/react";

import { PopoutActions } from "./use-popout-event";

export const BROADCAST_POPOUT_KEY = "BROADCAST_POPOUT_KEY";

interface PopoutStore {
	addPopout: (id: string) => void;
	chanel: string;
	clearPopouts: () => void;
	popouts: string[];
	removePopout: (id: string) => void;
}

export const usePopoutStore = create<PopoutStore>((set) => ({
	addPopout: (id) => set((state) => ({ popouts: [...state.popouts, id] })),
	chanel: BROADCAST_POPOUT_KEY,
	clearPopouts: () => set({ popouts: [] }),
	popouts: [],
	removePopout: (id) => set((state) => ({ popouts: state.popouts.filter((popoutId) => popoutId !== id) })),
}));

export const usePopout = () => {
	const addPopout = usePopoutStore((state) => state.addPopout);
	const clearPopouts = usePopoutStore((state) => state.clearPopouts);
	const removePopout = usePopoutStore((state) => state.removePopout);
	const chanel = usePopoutStore((state) => state.chanel);

	const broadcastChannel = new BroadcastChannel(chanel);

	const openPopout = () => {
		const id = nanoid();
		const url = `/popout/entity/${id}`;
		const target = id;

		const newWindow = window.open(
			url,
			target,
			`scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${900},height=${300},left=600,top=600`,
		);

		if (newWindow) {
			addPopout(id);
		}
	};

	const closeAll = () => {
		broadcastChannel.postMessage({ type: PopoutActions.CLOSE_ALL });
		broadcastChannel.close();
		clearPopouts();
	};

	const closeTarget = (target: string) => {
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
		openPopout,
	};
};
