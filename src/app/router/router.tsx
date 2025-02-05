import { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ChildComponent } from "../../pages/child-component/child-component";
import { MainComponent } from "../../pages/main-component/main-component";

const router = createBrowserRouter([
	{
		element: <MainComponent />,
		path: "*",
	},
	{
		element: <ChildComponent />,
		path: "/popout/:entity/:id",
	},
]);

export const Router: FC = () => {
	return <RouterProvider router={router} />;
};
