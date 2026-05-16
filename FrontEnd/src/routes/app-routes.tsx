import { createBrowserRouter } from "react-router-dom";
import Home from "../components/features/home/home";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
]);

export default router;