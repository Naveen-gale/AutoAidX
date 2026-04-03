import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import BrandPage from "../pages/BrandPage";
import ModelsPage from "../pages/ModelsPage";
import ProblemPage from "../pages/ProblemPage";
import SolutionPage from "../pages/SolutionPage";
import AiPage from "../pages/AiPage";
import AdminLogin from "../components/AdminLogin";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/brand",
        element: <BrandPage />,
    },
    {
        path: "/brand/:brandId",
        element: <ModelsPage />,
    },
    {
        path: "/brand/:brandId/:modelId",
        element: <ProblemPage />,
    },
    {
        path: "/brand/:brandId/:modelId/:problemId",
        element: <SolutionPage />,
    },
    {
        path: "/ai",
        element: <AiPage />,
    },
    {
        path: "/admin",
        element: <AdminLogin/>
    }
]);

export default router;