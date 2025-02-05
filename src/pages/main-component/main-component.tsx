import { usePopout, usePopoutStore } from "../../shared/use-popout-store";

export const MainComponent = () => {
	const { closeAll, closeTarget, focusPopout, openPopout } = usePopout();
	const popouts = usePopoutStore((state) => state.popouts);

	return (
		<div>
			<button onClick={openPopout}>Open Children</button>
			<button onClick={closeAll}>Close all childrens</button>
			<ul>
				{popouts.map((popout) => (
					<li key={popout}>
						<p>{popout}</p>
						<div>
							<button onClick={() => focusPopout(popout)}>Focus</button>
							<button onClick={() => closeTarget(popout)}>Close specific child</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};
