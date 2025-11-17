import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCreateHistory } from "../api/history.api";
import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";

const HistoryCreateSchema = z.object({
	studentId: z.coerce.number().min(1, "ID студента обовʼязковий"),
	roomNumber: z.coerce.number().min(1, "Номер кімнати обовʼязковий"),
	moveInDate: z.string().min(1, "Оберіть дату заселення"),
	moveOutDate: z.string().nullable(),
});

type HistoryCreateForm = z.input<typeof HistoryCreateSchema>;

export function HistoryCreatePage(): JSX.Element {
	const navigate = useNavigate();
	const createMutation = useCreateHistory();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<HistoryCreateForm>({
		resolver: zodResolver(HistoryCreateSchema),
		defaultValues: {
			moveOutDate: null,
		},
	});

	const onSubmit: SubmitHandler<HistoryCreateForm> = async (data) => {
		const payload = {
			student: Number(data.studentId),
			room: Number(data.roomNumber),
			moveInDate: data.moveInDate,
			moveOutDate: data.moveOutDate || null,
		};

		await createMutation.mutateAsync(payload);
		void navigate({ to: "/history" });
	};

	return (
		<div className="p-6 max-w-xl mx-auto space-y-4">
			<h1 className="text-2xl font-bold">Створити історію проживання</h1>

			<form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label>ID студента</label>
					<input
						className="border p-2 w-full"
						type="number"
						{...register("studentId")}
					/>
					{errors.studentId && (
						<p className="text-red-500">{errors.studentId.message}</p>
					)}
				</div>

				<div>
					<label>Номер кімнати</label>
					<input
						className="border p-2 w-full"
						type="number"
						{...register("roomNumber")}
					/>
					{errors.roomNumber && (
						<p className="text-red-500">{errors.roomNumber.message}</p>
					)}
				</div>

				<div>
					<label>Дата заселення</label>
					<input
						className="border p-2 w-full"
						type="date"
						{...register("moveInDate")}
					/>
					{errors.moveInDate && (
						<p className="text-red-500">{errors.moveInDate.message}</p>
					)}
				</div>

				<div>
					<label>Дата виселення</label>
					<input
						className="border p-2 w-full"
						type="date"
						{...register("moveOutDate")}
					/>
				</div>

				<button
					className="bg-blue-600 text-white px-4 py-2 rounded"
					disabled={isSubmitting}
					type="submit"
				>
					Створити
				</button>
			</form>
		</div>
	);
}
