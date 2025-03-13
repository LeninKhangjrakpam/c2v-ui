import { useState, useRef, useCallback, useEffect } from "react";

export interface XDraggablePropI {
	onXChange: (x: number) => boolean;
	initialX: number;
	xLimit: [number, number]; // lowerLimit, upperLimit
	width: number;
	zoom: number;
	children: JSX.Element;
}

const XDraggable = ({
	onXChange,
	initialX = 0,
	xLimit,
	width,
	zoom,
	children,
}: XDraggablePropI) => {
	const [isDragging, setIsDragging] = useState(false);
	const [currentX, setCurrentX] = useState(initialX * zoom * 100); // in pixels
	const dragStart = useRef({ x: 0, mouseX: 0 });

	const handleMouseDown = useCallback(
		(e: { clientX: number }) => {
			setIsDragging(true);
			dragStart.current = {
				x: currentX,
				mouseX: e.clientX,
			};
		},
		[currentX],
	);

	const handleMouseMove = useCallback(
		(e: { clientX: number }) => {
			if (!isDragging) return;

			const deltaX = e.clientX - dragStart.current.mouseX;
			const newX = dragStart.current.x + deltaX;

			if (
				newX >= xLimit[0] * 100 * zoom &&
				newX + width * 100 * zoom <= xLimit[1]
			) {
				const collide = onXChange(newX / (zoom * 100));
				if (!collide) setCurrentX(newX);
			}
		},
		[isDragging, onXChange, width, xLimit, zoom],
	);

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			const mvEvnt = e.touches.item(0);
			if (mvEvnt) handleMouseMove(mvEvnt);
		},
		[handleMouseMove],
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	useEffect(() => {
		setCurrentX(initialX * zoom * 100);
		if (isDragging) {
			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("mouseup", handleMouseUp);
			window.addEventListener("touchmove", handleTouchMove);
			window.addEventListener("touchend", handleMouseUp);

			return () => {
				window.removeEventListener("mousemove", handleMouseMove);
				window.removeEventListener("mouseup", handleMouseUp);
				window.removeEventListener("touchmove", handleTouchMove);
				window.removeEventListener("touchend", handleMouseUp);
			};
		}
	}, [
		isDragging,
		handleMouseMove,
		handleMouseUp,
		handleTouchMove,
		initialX,
		zoom,
	]);

	return (
		<div
			className="absolute select-none cursor-grab active:cursor-grabbing touch-none"
			style={{
				transform: `translateX(${currentX}px)`,
				width: zoom * width * 100,
			}}
			onMouseDown={handleMouseDown}
			onTouchStart={(e) => handleMouseDown(e.touches.item(0))}>
			{children}
		</div>
	);
};

export default XDraggable;
