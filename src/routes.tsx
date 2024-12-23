import About from "./pages/about";
import Page from "./pages/page";
import Home from "./pages/home";
import List from "./pages/list";
import NotFound from "./pages/404";

type AppRoutes = {
	name: string;
	href: string;
	elm: JSX.Element;
};

const Routes: AppRoutes[] = [
	{ name: "Home", href: "/", elm: <Home /> },
	{ name: "Home", href: "/home", elm: <Home /> },
	{ name: "Model", href: "/models", elm: <Page /> },
	{ name: "List", href: "/list", elm: <List /> },
	{ name: "About", href: "/about", elm: <About /> },
	{ name: "NotFound", href: "*", elm: <NotFound /> },
];

export default Routes;
