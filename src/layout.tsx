import { Outlet } from "react-router";
import Footer from "./components/footer";
import Navbar from "./components/navbar";

const Layout = () => {
	return (
		<>
			<Navbar>
				<Outlet />
			</Navbar>
			<Footer />
		</>
	);
};

export default Layout;
