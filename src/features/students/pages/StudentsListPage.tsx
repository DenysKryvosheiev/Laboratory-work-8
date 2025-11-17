import { Link } from "@tanstack/react-router";
import { useStudents, useDeleteStudent } from "../api/student.api";
import type { JSX } from "react";
import dayjs from "dayjs";

export function StudentsListPage(): JSX.Element {
	const { data: students, isLoading, isError, error } = useStudents();
	const deleteStudent = useDeleteStudent();
	if (isLoading) {
		return <div className="p-4">Завантаження студентів...</div>;
	}
	if (isError) {
		return (
			<div className="p-4 text-red-500">
				Помилка: {error?.message ?? "Невідома помилка"}
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Заголовок */}
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Список студентів</h1>

				<Link
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					to="/students/new"
				>
					➕ Додати студента
				</Link>
			</div>
			<div className="overflow-auto rounded border border-gray-300 shadow">
				<table className="min-w-full border-collapse">
					<thead className="bg-gray-100">
					<tr>
						<th className="border px-4 py-2 text-left">ID</th>
						<th className="border px-4 py-2 text-left">ПІБ</th>
						<th className="border px-4 py-2 text-left">Телефон</th>
						<th className="border px-4 py-2 text-left">Квиток</th>
						<th className="border px-4 py-2 text-left">Дата нар.</th>
						<th className="border px-4 py-2 text-left">Дата реєстрації</th>
						<th className="border px-4 py-2 text-left">Пільги</th>
						<th className="border px-4 py-2 text-left">Дії</th>
					</tr>
					</thead>

					<tbody>
					{students?.map((s) => (
						<tr key={s.id} className="hover:bg-gray-50">
							<td className="border px-4 py-2">{s.id}</td>

							<td className="border px-4 py-2 font-medium">
								{s.lastName} {s.firstName} {s.middleName ?? ""}
							</td>

							<td className="border px-4 py-2">{s.phoneNumber}</td>

							<td className="border px-4 py-2">{s.studentCardNumber}</td>

							{/* Форматування дат */}
							<td className="border px-4 py-2">
								{dayjs(s.birthDate).format("DD.MM.YYYY")}
							</td>

							<td className="border px-4 py-2">
								{dayjs(s.registrationDate).format("DD.MM.YYYY")}
							</td>

							{/* Пільги */}
							<td className="border px-4 py-2">
								{s.benefits ?? "—"}
							</td>

							<td className="border px-4 py-2 space-x-3">
								<Link
									className="text-blue-600 hover:underline"
									params={{ studentId: String(s.id) }}
									to="/students/$studentId"
								>
									✏ Редагувати
								</Link>

								<button
									className="text-red-600 hover:underline"
									onClick={() => { deleteStudent.mutate(String(s.id)); }}
								>
									🗑 Видалити
								</button>
							</td>
						</tr>
					))}

					{students?.length === 0 && (
						<tr>
							<td
								className="px-4 py-6 text-center text-gray-500"
								colSpan={8}
							>
								Студентів поки що немає
							</td>
						</tr>
					)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
