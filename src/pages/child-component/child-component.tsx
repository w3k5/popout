import { useParams } from "react-router-dom";

import { usePopoutEvent } from "../../shared/use-popout-event";

export const ChildComponent = () => {
	const { id } = useParams<{ id: string }>();

	usePopoutEvent();

	return <div>Children {id}</div>;
};
