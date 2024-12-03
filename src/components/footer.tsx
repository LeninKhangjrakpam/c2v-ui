import viteLogo from "../assets/vite.svg";
import reactLogo from "../assets/react.svg";

const Footer = () => {
	return (
		<div className="bg-gray-800 text-center w-full p-2 relative">
			<div className="relative mx-auto max-w-7xl sm:px-6 lg:px-8">
				<p className="text-lg">Comic to Video Project</p>
				<p className="text-sm">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
					animi magni id laudantium odio voluptatibus natus maiores quaerat
					dolor? Perspiciatis voluptas placeat repellendus quam quidem quibusdam
					iusto magnam praesentium ea. Lorem ipsum dolor sit amet consectetur
					adipisicing elit. Consequatur delectus magnam non itaque. Unde ad
					fugit error facere quas tenetur quibusdam possimus ratione debitis
					dolorem minima nemo, autem alias repellendus.
				</p>
				<p className="text-md">Built with React</p>
				<div className="m-auto text-center flex justify-center items-center gap-2 py-2">
					<img src={viteLogo} alt="vite-logo" className="w-10" />
					<img src={reactLogo} alt="react-logo" className="w-10" />
				</div>
				<div className="text-sm">
					Copyright &#169; {new Date().getFullYear()}
				</div>
			</div>
		</div>
	);
};

export default Footer;
