import { FC, useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";

interface ItemType {
	id: number;
	name: string;
}

const BasicFunction: FC = () => {
	const [state, setState] = useState<ItemType[]>([]);

	useEffect(
		() =>
			setState(
				Array.from({ length: 30 }, (_, i) => ({
					id: i,
					name: `${i % 2 === 0 ? 16 : 18}.jpg`,
				})),
			),
		[],
	);

	return (
		<div className="text-black border">
			<ReactSortable
				list={state}
				setList={setState}
				className="text-black flex flex-row flex-wrap borderitems-center justify-center">
				{state.map((item) => (
					<div
						key={item.id}
						className="border flex flex-col items-center justify-center hover:px-2 hover:bg-rose-100">
						<img src={item.name} className="w-20" />
						{item.id}
					</div>
				))}
			</ReactSortable>
		</div>
	);
};

export default BasicFunction;
