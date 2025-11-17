import { Link } from "@tanstack/react-router";
import { useHistories, useDeleteHistory } from "../api/history.api";
import type { JSX } from "react";

export function HistoryListPage(): JSX.Element {
	const { data: histories, isLoading, isError, error } = useHistories();
	const deleteMutation = useDeleteHistory();

	if (isLoading) {
		return <div className="p-4">Завантаження історії проживання...</div>;
	}

	if (isError) {
		return (
			<div className="p-4 text-red-500">
				Помилка: {error?.message ?? "Невідома помилка"}
			</div>
		);
	}

	return (
		<div className="p-6 space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Історія проживання студентів</h1>

				<Link
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					to="/history/new"
				>
					➕ Додати запис
				</Link>
			</div>

			<table className="min-w-full border border-gray-300">
				<thead className="bg-gray-100">
				<tr>
					<th className="border px-3 py-2">ID</th>
					<th className="border px-3 py-2">Студент</th>
					<th className="border px-3 py-2">Кімната</th>
					<th className="border px-3 py-2">Дата заселення</th>
					<th className="border px-3 py-2">Дата виселення</th>
					<th className="border px-3 py-2">Дії</th>
				</tr>
				</thead>

				<tbody>
				{histories?.map((h) => (
					<tr key={h.id} className="border-t">
						<td className="border px-3 py-2">{h.id}</td>

						<td className="border px-3 py-2">
							{h.student
								? `${h.student.lastName} ${h.student.firstName} ${h.student.middleName ?? ""}`
								: "—"}
						</td>

						<td className="border px-3 py-2">
							{h.room ? h.room.roomNumber : "—"}
						</td>

						<td className="border px-3 py-2">
							{h.moveInDate}
						</td>

						<td className="border px-3 py-2">
							{h.moveOutDate ?? "Ще проживає"}
						</td>

						<td className="border px-3 py-2 space-x-4">
							<Link
								className="text-blue-600 hover:underline"
								params={{ historyId: String(h.id) }}
								to="/history/$historyId"
							>
								✏ Редагувати
							</Link>

							<button
								className="text-red-600 hover:underline"
								onClick={() => { deleteMutation.mutate(String(h.id)); }}
							>
								🗑 Видалити
							</button>
						</td>

					</tr>
				))}

				{histories?.length === 0 && (
					<tr>
						<td className="py-4 text-center text-gray-500" colSpan={6}>
							Записів поки що немає
						</td>
					</tr>
				)}
				</tbody>
			</table>
		</div>
	);
}
