import React from "react";

const Card = ({ children }: { children: React.JSX.Element }) => {
	return <div className="relative w-fit overflow-hidden">{children}</div>;
};

export default Card;
