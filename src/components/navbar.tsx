import { NavLink } from "react-router";
import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ToastsContext from "../hooks/createToastContext";
import ToastContainer from "./Toast/toastContainer";
import useToast from "../hooks/useToast";
import Mark from "../assets/mark.svg";

const navigation = [
	{ name: "Home", href: "/" },
	{ name: "Models", href: "/models" },
	{ name: "About", href: "/about" },
];

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export default function Navbar({
	children,
}: {
	children: React.ReactElement | null;
}) {
	const [toasts, createToast] = useToast();

	return (
		<div className="min-h-full">
			<Disclosure
				as="nav"
				className="bg-gray-800/80 sticky top-0 backdrop-blur-md z-[1]">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div
							className="flex items-center justify-between w-100 relative"
							style={{ width: "100%" }}>
							<div className="shrink-0 flex items-center gap-2">
								<img alt="Comic2Video" src={Mark} className="size-8" />
								<div className="text-xl font-bold">Comic2Video</div>
							</div>
							<div className="hidden md:block relative">
								<div className="ml-10 flex items-baseline space-x-4">
									{navigation.map((item, i) => {
										return (
											<NavLink
												to={item.href}
												key={i}
												className={({ isActive }) =>
													classNames(
														isActive
															? "bg-gray-900 text-white"
															: "text-gray-300 hover:bg-gray-700 hover:text-white",
														"rounded-md px-3 py-2 text-sm font-medium",
													)
												}>
												{item.name}
											</NavLink>
										);
									})}
								</div>
							</div>
						</div>

						<div className="-mr-2 flex md:hidden">
							{/* Mobile menu button */}
							<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
								<span className="absolute -inset-0.5" />
								<span className="sr-only">Open main menu</span>
								<Bars3Icon
									aria-hidden="true"
									className="block size-6 group-data-[open]:hidden"
								/>
								<XMarkIcon
									aria-hidden="true"
									className="hidden size-6 group-data-[open]:block"
								/>
							</DisclosureButton>
						</div>
					</div>
				</div>

				<DisclosurePanel className="md:hidden">
					<div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
						{navigation.map((item, i) => (
							<NavLink
								to={item.href}
								key={i}
								className={({ isActive }) =>
									classNames(
										isActive
											? "bg-gray-900 text-white"
											: "text-gray-300 hover:bg-gray-700 hover:text-white",
										"block rounded-md px-3 py-2 text-base font-medium",
									)
								}>
								{item.name}
							</NavLink>
						))}
					</div>
				</DisclosurePanel>
			</Disclosure>

			<main className="bg-grid-light">
				<div
					className="mx-auto max-w-7xl md:px-4 px-1 py-6 sm:px-6 lg:px-8"
					style={{
						minHeight: "90dvh",
					}}>
					<ToastsContext.Provider value={createToast}>
						{children}
					</ToastsContext.Provider>
				</div>

				{/* Toasts Outlets */}
				{toasts.length !== 0 && <ToastContainer toasts={toasts} />}
			</main>
		</div>
	);
}
