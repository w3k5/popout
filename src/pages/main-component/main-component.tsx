import { nanoid } from "nanoid";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { PopoutActions, usePopoutEvent } from "../../shared/use-popout-event";
import { usePopout, usePopoutStore } from "../../shared/use-popout-store";
import styles from "./main-component.module.css";

export const MainComponent = () => {
	const [params] = useSearchParams();
	const initialChannelName = params.get("channel") ?? "default_channel";
	const { closeAll, closeTarget, openPopout, popouts, removePopout } = usePopout();
	const init = usePopoutStore((state) => state.init);

	const mockList = useMemo(() => Array.from({ length: 30 }).map(() => nanoid(4)), []);

	useEffect(() => {
		init(initialChannelName);
	}, []);

	usePopoutEvent(initialChannelName, {
		[PopoutActions.CLOSE_TARGET]: (target) => {
			if (target) {
				removePopout(target);
			}
		},
	});

	return (
		<div style={{ display: "flex" }}>
			<div className={styles.section}>
				<button onClick={() => openPopout({ channel: initialChannelName, target: `/popout/entity/${nanoid(4)}` })}>
					Open Children
				</button>
				<button onClick={() => closeAll({ channel: initialChannelName })}>Close all childrens</button>
				<table className={styles.table}>
					<thead>
						<tr>
							<th className={styles.tableHeader}>Название</th>
							<th className={styles.tableHeader}>Действия</th>
						</tr>
					</thead>
					<tbody>
						{mockList.map((popout) => {
							const href = `${location.href}popout/entity/${popout}?channel=${initialChannelName}`;
							const isOpen = popouts.includes(href);

							return (
								<tr className={styles.tableRow} key={popout}>
									<td>{popout}</td>
									<td>
										<button
											onClick={() =>
												openPopout({
													channel: initialChannelName,
													target: `/popout/entity/${popout}`,
												})
											}
										>
											{isOpen ? "Сфокусировать" : "Открыть"}
										</button>
										{isOpen && <button onClick={() => closeTarget(initialChannelName, href)}>Закрыть</button>}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};
