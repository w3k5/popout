import { useEffect } from "react";

export interface BroadcastEvent<T = never> {
	data: {
		type: T;
	};
}

export const useBroadcastChannel = <T extends BroadcastEvent>(
	channelName: string,
	options: { onMessage?: (event: MessageEvent<T>) => void },
) => {
	useEffect(() => {
		const channel = new BroadcastChannel(channelName);

		const handleMessage = (event: MessageEvent<T>) => {
			if (options.onMessage) {
				options.onMessage(event);
			}
		};

		channel.addEventListener("message", handleMessage);

		return () => {
			channel.removeEventListener("message", handleMessage);
			channel.close();
		};
	}, [channelName, options]);
};
