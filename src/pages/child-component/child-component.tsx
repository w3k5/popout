import { nanoid } from "nanoid";
import { useParams, useSearchParams } from "react-router-dom";

import { usePopoutEvent } from "../../shared/use-popout-event";
import { usePopout } from "../../shared/use-popout-store";

export const ChildComponent = () => {
	const [params] = useSearchParams();
	const { id } = useParams<{ id: string }>();
	const { closeAll, closeTarget, focusPopout, openPopout, popouts } = usePopout();

	const channel = params.get("channel");

	if (!channel) {
		throw new Error("Невозможно использовать слушатель событий попаутов без указанного канала");
	}

	usePopoutEvent(channel);

	return (
		<div>
			Children {id}. Channel: {channel}
			<button onClick={() => closeAll({ channel, shouldCloseCurrent: true })}>
				Закрыть все дочерние окна канала, включая текущее окно
			</button>
			<button onClick={() => openPopout({ channel, target: `/test/${nanoid(4)}` })}>
				Открыть попаут из дочки с тем же каналом на другом урле
			</button>
			<button
				onClick={() => openPopout({ channel: `another_chanel_by_id-${id}_chanel-${channel}`, target: `/${nanoid(4)}` })}
			>
				Открыть попаут из дочки с другим каналом
			</button>
			<ul>
				{popouts.map((popout) => (
					<li key={popout}>
						<p>{popout}</p>
						<div>
							<button onClick={() => focusPopout(popout)}>Focus</button>
							<button onClick={() => closeTarget(channel, popout)}>Close specific child</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};
