import { nanoid } from "nanoid";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { usePopoutEvent } from "../../shared/use-popout-event";
import { usePopout, usePopoutStore } from "../../shared/use-popout-store";

export const MainComponent = () => {
	const [params] = useSearchParams();
	const initialChannelName = params.get("channel") ?? "default_channel";
	const { closeAll, closeTarget, openPopout } = usePopout();
	const init = usePopoutStore((state) => state.init);

	const mockList = useMemo(() => Array.from({ length: 50 }).map(() => nanoid(4)), []);

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
				{mockList.map((popout) => (
					<li key={popout}>
						<p>{popout}</p>
						<div>
							<button onClick={() => openPopout({ channel: initialChannelName, target: `/popout/entity/${popout}` })}>
								Focus
							</button>
							<button onClick={() => closeTarget(initialChannelName, popout)}>Close specific child</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};
