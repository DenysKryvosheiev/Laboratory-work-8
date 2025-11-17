import { Link } from "@tanstack/react-router";
import { useRooms, useDeleteRoom } from "../api/room.api";
import type { JSX } from "react";

function RoomsListPage(): JSX.Element {
	const { data: rooms, isLoading, isError, error } = useRooms();
	const deleteMutation = useDeleteRoom();

	if (isLoading) return <div className="p-4">Завантаження...</div>;
	if (isError) return <div className="p-4 text-red-500">Помилка: {error?.message}</div>;

	return (
		<div className="p-6 space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Список кімнат</h1>

				<Link
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					to="/rooms/new"
				>
					➕ Додати кімнату
				</Link>
			</div>

			<table className="min-w-full border border-gray-300">
				<thead className="bg-gray-100">
				<tr>
					<th className="border px-3 py-2">Номер</th>
					<th className="border px-3 py-2">Місця</th>
					<th className="border px-3 py-2">Площа</th>
					<th className="border px-3 py-2">Дії</th>
				</tr>
				</thead>

				<tbody>
				{rooms?.map((room) => (
					<tr key={room.roomNumber} className="border-t">
						<td className="border px-3 py-2">{room.roomNumber}</td>
						<td className="border px-3 py-2">{room.places}</td>
						<td className="border px-3 py-2">{room.area}</td>

						<td className="border px-3 py-2 space-x-3">
							<Link
								className="text-blue-600 hover:underline"
								params={{ roomNumber: String(room.roomNumber) }}
								to="/rooms/$roomNumber"
							>
								✏ Редагувати
							</Link>

							<button
								className="text-red-600 hover:underline"
								onClick={() => { deleteMutation.mutate(String(room.roomNumber)); }}
							>
								🗑 Видалити
							</button>
						</td>
					</tr>
				))}

				{rooms?.length === 0 && (
					<tr>
						<td className="py-4 text-center text-gray-500" colSpan={4}>
							Немає кімнат
						</td>
					</tr>
				)}
				</tbody>
			</table>
		</div>
	);
}

export default RoomsListPage
