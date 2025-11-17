import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useCreateRoom } from "../api/room.api";
import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";

const RoomCreateSchema = z.object({
	roomNumber: z
		.string()
		.min(1, "Введіть номер кімнати")
		.refine((v) => !isNaN(Number(v)), "Має бути числом"),

	places: z
		.string()
		.min(1, "Введіть кількість місць")
		.refine((v) => !isNaN(Number(v)), "Має бути числом"),

	area: z
		.string()
		.min(1, "Введіть площу")
		.refine((v) => !isNaN(Number(v)), "Має бути числом"),
});

type RoomCreateForm = z.infer<typeof RoomCreateSchema>;

export function RoomCreatePage(): JSX.Element {
	const navigate = useNavigate();
	const createRoomMutation = useCreateRoom();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RoomCreateForm>({
		resolver: zodResolver(RoomCreateSchema),
	});

	const onSubmit: SubmitHandler<RoomCreateForm> = async (data) => {
		const payload = {
			roomNumber: Number(data.roomNumber),
			places: Number(data.places),
			area: Number(data.area),
		};

		await createRoomMutation.mutateAsync(payload);
		void navigate({ to: "/rooms"});
	};

	return (
		<div className="p-6 max-w-xl mx-auto space-y-4">
			<h1 className="text-2xl font-bold">Додати кімнату</h1>

			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
				{/* Номер кімнати */}
				<div>
					<label>Номер кімнати</label>
					<input className="border p-2 w-full" {...register("roomNumber")} />
					{errors.roomNumber && (
						<p className="text-red-500">{errors.roomNumber.message}</p>
					)}
				</div>

				{/* Кількість місць */}
				<div>
					<label>Кількість місць</label>
					<input className="border p-2 w-full" {...register("places")} />
					{errors.places && (
						<p className="text-red-500">{errors.places.message}</p>
					)}
				</div>

				{/* Площа кімнати */}
				<div>
					<label>Площа (кв. м)</label>
					<input className="border p-2 w-full" {...register("area")} />
					{errors.area && (
						<p className="text-red-500">{errors.area.message}</p>
					)}
				</div>

				<button
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					disabled={isSubmitting}
					type="submit"
				>
					Створити
				</button>
			</form>
		</div>
	);
}
