import React, { useState, useEffect, useCallback } from "react";

export interface MenuItemI {
	label: JSX.Element;
	clickHandler: (e?: React.MouseEvent) => void;
	disabled?: boolean;
}

export interface ContextMenuPropsI {
	children: JSX.Element;
	items: MenuItemI[];
}
const ContextMenu = ({ children, items }: ContextMenuPropsI) => {
	const [isVisible, setIsVisible] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	const handleContextMenu = useCallback((event: React.MouseEvent) => {
		event.preventDefault();
		setIsVisible(true);
		setPosition({
			x: event.clientX,
			y: event.clientY,
		});
	}, []);

	const handleClick = useCallback(() => {
		setIsVisible(false);
	}, []);

	useEffect(() => {
		document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, [handleClick]);

	return (
		<div className="relative inline-block" onContextMenu={handleContextMenu}>
			{children}

			{isVisible && (
				<div
					className="fixed z-50 min-w-[160px] bg-white rounded-md shadow-lg border border-gray-200"
					style={{
						top: `${position.y}px`,
						left: `${position.x}px`,
					}}>
					<ul className="py-1">
						{items.map((item, index) => (
							<li key={index}>
								<button
									onClick={() => {
										item.clickHandler();
										setIsVisible(false);
									}}
									className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
									disabled={item.disabled ?? false}>
									{item.label}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default ContextMenu;
