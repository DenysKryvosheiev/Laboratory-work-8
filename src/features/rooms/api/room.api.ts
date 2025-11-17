import {
	useQuery,
	useMutation,
	useQueryClient,
	type UseQueryResult,
	type UseMutationResult,
} from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type { Room } from "../types/room.types";

export const getRooms = async (): Promise<Array<Room>> => {
	const response = await apiClient.get("/Rooms");
	return response.data as Array<Room>;
};

export const getRoomByNumber = async (roomNumber: string): Promise<Room> => {
	const response = await apiClient.get(`/Rooms/${roomNumber}`);
	return response.data as Room;
};

export const createRoom = async (
	payload: Room
): Promise<Room> => {
	const response = await apiClient.post("/Rooms", payload);
	return response.data as Room;
};

export const updateRoom = async ({
																	 roomNumber,
																	 data,
																 }: {
	roomNumber: string;
	data: Partial<Room>;
}): Promise<Room> => {
	const response = await apiClient.patch(`/Rooms/${roomNumber}`, data);
	return response.data as Room;
};

export const deleteRoom = async (roomNumber: string): Promise<void> => {
	await apiClient.delete(`/Rooms/${roomNumber}`);
};
export const useRooms = (): UseQueryResult<Array<Room>> =>
	useQuery<Array<Room>>({
		queryKey: ["rooms"],
		queryFn: getRooms,
	});

export const useRoom = (roomNumber: string): UseQueryResult<Room> =>
	useQuery<Room>({
		queryKey: ["rooms", roomNumber],
		queryFn: () => getRoomByNumber(roomNumber),
		enabled: Boolean(roomNumber),
	});

export const useCreateRoom = (): UseMutationResult<Room, unknown, Room> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createRoom,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["rooms"] });
		},
	});
};

export const useUpdateRoom = (): UseMutationResult<
	Room,
	unknown,
	{ roomNumber: string; data: Partial<Room> }
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateRoom,
		onSuccess: (updated) => {
			void queryClient.invalidateQueries({ queryKey: ["rooms"] });
			void queryClient.setQueryData(["rooms", updated.roomNumber], updated);
		},
	});
};

export const useDeleteRoom = (): UseMutationResult<void, unknown, string> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteRoom,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["rooms"] });
		},
	});
};
