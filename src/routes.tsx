import About from "./pages/about";
import Page from "./pages/page";
import Home from "./pages/home";
import List from "./pages/list";

type AppRoutes = {
	name: string;
	href: string;
	elm: JSX.Element;
};

const Routes: AppRoutes[] = [
	{ name: "Home", href: "/", elm: <Home /> },
	{ name: "Model", href: "/models", elm: <Page /> },
	{ name: "List", href: "/list", elm: <List /> },
	{ name: "About", href: "/about", elm: <About /> },
];

export default Routes;
