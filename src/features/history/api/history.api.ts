import {
	useQuery,
	useMutation,
	useQueryClient,
	type UseQueryResult,
	type UseMutationResult,
} from "@tanstack/react-query";

import apiClient from "@/lib/axios";
import type {
	StudentRoomHistory,
	CreateStudentRoomHistory,
	UpdateStudentRoomHistory,
} from "../types/history.types";

export const getHistories = async (): Promise<Array<StudentRoomHistory>> => {
	const response = await apiClient.get("/histories");
	return response.data as Array<StudentRoomHistory>;
};

export const getHistoryById = async (
	id: string,
): Promise<StudentRoomHistory> => {
	const response = await apiClient.get(`/histories/${id}`);
	return response.data as StudentRoomHistory;
};

export const createHistory = async (
	payload: CreateStudentRoomHistory,
): Promise<StudentRoomHistory> => {
	const response = await apiClient.post("/histories", payload);
	return response.data as StudentRoomHistory;
};

export const updateHistory = async ({
																			id,
																			data,
																		}: {
	id: string;
	data: UpdateStudentRoomHistory;
}): Promise<StudentRoomHistory> => {
	const response = await apiClient.patch(`/histories/${id}`, data);
	return response.data as StudentRoomHistory;
};

export const deleteHistory = async (id: string): Promise<void> => {
	await apiClient.delete(`/histories/${id}`);
};


export const useHistories = (): UseQueryResult<
	Array<StudentRoomHistory>
> =>
	useQuery({
		queryKey: ["histories"],
		queryFn: getHistories,
	});

export const useHistory = (
	id: string,
): UseQueryResult<StudentRoomHistory> =>
	useQuery({
		queryKey: ["history", id],
		queryFn: () => getHistoryById(id),
		enabled: Boolean(id),
	});

export const useCreateHistory = (): UseMutationResult<
	StudentRoomHistory,
	unknown,
	CreateStudentRoomHistory
> => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createHistory,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["histories"] });
		},
	});
};

export const useUpdateHistory = (): UseMutationResult<
	StudentRoomHistory,
	unknown,
	{ id: string; data: UpdateStudentRoomHistory }
> => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateHistory,
		onSuccess: (updated) => {
			void queryClient.invalidateQueries({ queryKey: ["histories"] });
			void queryClient.setQueryData(["history", updated.id], updated);
		},
	});
};

export const useDeleteHistory = (): UseMutationResult<
	void,
	unknown,
	string
> => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteHistory,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["histories"] });
		},
	});
};
