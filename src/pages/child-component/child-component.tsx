import { nanoid } from "nanoid";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { usePopoutEvent } from "../../shared/use-popout-event";
import { usePopout } from "../../shared/use-popout-store";

const useBeforeUnload = (callback: () => void) => {
	useEffect(() => {
		const handleBeforeUnload = () => {
			callback();
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, []);
};

export const ChildComponent = () => {
	const [params] = useSearchParams();
	const { id } = useParams<{ id: string }>();
	const { closeAll, closeTarget, focusPopout, openPopout, popouts } = usePopout();

	const channel = params.get("channel");

	if (!channel) {
		throw new Error("Невозможно использовать слушатель событий попаутов без указанного канала");
	}

	usePopoutEvent(channel);

	useBeforeUnload(() => closeTarget(channel, location.href));

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
			<h3>Children {id}</h3>
			<h3>Таргет {location.href}</h3>
			<h3>Канал {channel}</h3>
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
