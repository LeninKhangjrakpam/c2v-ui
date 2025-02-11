import { HashRouter, Routes, Route } from "react-router";
import "./index.css";
import Layout from "./layout";
import RoutePaths from "./routes";

function App() {
	return (
		<HashRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					{RoutePaths.map((route, i) => (
						<Route path={route.href} element={route.elm} key={i} />
					))}
				</Route>
			</Routes>
		</HashRouter>
	);
}

// import About from "./pages/about";
// import Page from "./pages/page";
// import Model from "./pages/model";

// function App1() {
// 	return (
// 		<BrowserRouter>
// 			<Routes>
// 				<Route path="/" element={<Layout />}>
// 					<Route path="/" element={<Page />} />
// 					<Route path="/models" element={<Model />} />
// 					<Route path="/about" element={<About />} />
// 				</Route>
// 			</Routes>
// 		</BrowserRouter>
// 	);
// }

export default App;
