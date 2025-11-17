import { useParams, useNavigate } from "@tanstack/react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHistory, useUpdateHistory } from "../api/history.api";
import { useEffect } from "react";
// eslint-disable-next-line no-duplicate-imports
import type { JSX } from "react";


const HistoryEditSchema = z.object({
	studentId: z.coerce.number().min(1, "ID студента обовʼязковий"),
	roomNumber: z.coerce.number().min(1, "Номер кімнати обовʼязковий"),
	moveInDate: z.string().min(1, "Дата заселення обовʼязкова"),
	moveOutDate: z.string().nullable(),
});

type HistoryEditForm = z.input<typeof HistoryEditSchema>;

export function HistoryEditPage(): JSX.Element {
	const { historyId } = useParams({ from: "/history/$historyId" });
	const navigate = useNavigate();

	const { data: history } = useHistory(historyId);
	const updateHistoryMutation = useUpdateHistory();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<HistoryEditForm>({
		resolver: zodResolver(HistoryEditSchema),
	});

	useEffect(() => {
		if (history) {
			reset({
				studentId: history.student?.id ?? "",
				roomNumber: history.room?.roomNumber ?? "",
				moveInDate: history.moveInDate,
				moveOutDate: history.moveOutDate,
			});
		}
	}, [history, reset]);

	const onSubmit: SubmitHandler<HistoryEditForm> = async (form) => {
		await updateHistoryMutation.mutateAsync({
			id: historyId,
			data: {
				student: Number(form.studentId),
				room: Number(form.roomNumber),
				moveInDate: form.moveInDate,
				moveOutDate: form.moveOutDate || null,
			},
		});

		await navigate({ to: "/history" });
	};

	return (
		<div className="p-6 max-w-xl mx-auto space-y-3">
			<h1 className="text-2xl font-bold">Редагувати запис #{historyId}</h1>

			<form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label>ID студента</label>
					<input type="number" {...register("studentId")} className="border p-2 w-full" />
					{errors.studentId && <p className="text-red-500">{errors.studentId.message}</p>}
				</div>

				<div>
					<label>Номер кімнати</label>
					<input type="number" {...register("roomNumber")} className="border p-2 w-full" />
					{errors.roomNumber && <p className="text-red-500">{errors.roomNumber.message}</p>}
				</div>

				<div>
					<label>Дата заселення</label>
					<input type="date" {...register("moveInDate")} className="border p-2 w-full" />
				</div>

				<div>
					<label>Дата виселення</label>
					<input type="date" {...register("moveOutDate")} className="border p-2 w-full" />
				</div>

				<button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isSubmitting}>
					Зберегти зміни
				</button>
			</form>
		</div>
	);
}
