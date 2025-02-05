import { nanoid } from "nanoid";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { usePopoutEvent } from "../../shared/use-popout-event";
import { usePopout, usePopoutStore } from "../../shared/use-popout-store";

export const MainComponent = () => {
	const [params] = useSearchParams();
	const initialChannelName = params.get("channel") ?? "default_channel";
	const { closeAll, closeTarget, focusPopout, openPopout } = usePopout();
	const popouts = usePopoutStore((state) => state.popouts);
	const init = usePopoutStore((state) => state.init);

	useEffect(() => {
		init(initialChannelName);
	}, []);

	usePopoutEvent(initialChannelName);

	return (
		<div>
			<button onClick={() => openPopout({ channel: initialChannelName, target: `/popout/entity/${nanoid(4)}` })}>
				Open Children
			</button>
			<button onClick={() => closeAll({ channel: initialChannelName })}>Close all childrens</button>
			<ul>
				{popouts.map((popout) => (
					<li key={popout}>
						<p>{popout}</p>
						<div>
							<button onClick={() => focusPopout(popout)}>Focus</button>
							<button onClick={() => closeTarget(initialChannelName, popout)}>Close specific child</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};
