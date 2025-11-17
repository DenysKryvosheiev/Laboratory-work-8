import { useParams, useNavigate } from "@tanstack/react-router";
import {
	useForm,
	type SubmitHandler,
	type Resolver,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRoom, useUpdateRoom } from "../api/room.api";
import { useEffect } from "react";
// eslint-disable-next-line no-duplicate-imports
import type { JSX } from "react";

const RoomEditSchema = z.object({
	places: z.coerce.number().min(1, "Місць має бути хоча б 1"),
	area: z.coerce.number().min(5, "Площа має бути більшою за 5 м²"),
});

type RoomEditForm = z.infer<typeof RoomEditSchema>;

export function RoomEditPage(): JSX.Element {
	const { roomNumber } = useParams({ from: "/rooms/$roomNumber" });
	const navigate = useNavigate();

	const { data: room, isLoading } = useRoom(roomNumber);
	const updateRoomMutation = useUpdateRoom();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<RoomEditForm>({
		resolver: zodResolver(RoomEditSchema) as Resolver<RoomEditForm>,
		defaultValues: {
			places: 1,
			area: 10,
		},
	});

	useEffect(() => {
		if (room) {
			reset({
				places: room.places,
				area: room.area,
			});
		}
	}, [room, reset]);

	if (isLoading) return <div className="p-4">Завантаження...</div>;

	const onSubmit: SubmitHandler<RoomEditForm> = async (form) => {
		await updateRoomMutation.mutateAsync({
			roomNumber,
			data: form,
		});

		await navigate({ to: "/rooms" });
	};

	return (
		<div className="p-6 max-w-xl mx-auto space-y-3">
			<h1 className="text-2xl font-bold">Редагувати кімнату №{roomNumber}</h1>

			<form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label>Кількість місць</label>
					<input
						type="number"
						{...register("places")}
						className="border p-2 w-full"
					/>
					{errors.places && (
						<p className="text-red-500">{errors.places.message}</p>
					)}
				</div>

				<div>
					<label>Площа (м²)</label>
					<input
						step="0.1"
						type="number"
						{...register("area")}
						className="border p-2 w-full"
					/>
					{errors.area && (
						<p className="text-red-500">{errors.area.message}</p>
					)}
				</div>

				<button
					className="bg-blue-600 text-white px-4 py-2 rounded"
					disabled={isSubmitting}
				>
					Зберегти зміни
				</button>
			</form>
		</div>
	);
}
