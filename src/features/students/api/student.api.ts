import {
	useQuery,
	useMutation,
	useQueryClient,
	type UseQueryResult,
	type UseMutationResult,
} from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type { Student } from "../types/student.types";

export const getStudents = async (): Promise<Array<Student>> => {
	const response = await apiClient.get("/Students");
	return response.data as Array<Student>;
};

export const getStudentById = async (id: string): Promise<Student> => {
	const response = await apiClient.get(`/Students/${id}`);
	return response.data as Student;
};

export const createStudent = async (
	payload: Omit<Student, "id">
): Promise<Student> => {
	const response = await apiClient.post("/Students", payload);
	return response.data as Student;
};

export const updateStudent = async ({
																			id,
																			data,
																		}: {
	id: string;
	data: Partial<Student>;
}): Promise<Student> => {
	const response = await apiClient.put(`/Students/${id}`, data);
	return response.data as Student;
};

export const deleteStudent = async (id: string): Promise<void> => {
	await apiClient.delete(`/Students/${id}`);
};

export const useStudents = (): UseQueryResult<Array<Student>> =>
	useQuery<Array<Student>>({
		queryKey: ["students"],
		queryFn: getStudents,
	});

export const useStudent = (id: string): UseQueryResult<Student> =>
	useQuery<Student>({
		queryKey: ["students", id],
		queryFn: () => getStudentById(id),
		enabled: Boolean(id),
	});

export const useCreateStudent = (): UseMutationResult<
	Student,
	unknown,
	Omit<Student, "id">
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createStudent,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["students"] });
		},
	});
};

export const useUpdateStudent = (): UseMutationResult<
	Student,
	unknown,
	{ id: string; data: Partial<Student> }
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateStudent,
		onSuccess: (updated) => {
			void queryClient.invalidateQueries({ queryKey: ["students"] });
			void queryClient.setQueryData(["students", updated.id], updated);
		},
	});
};

export const useDeleteStudent = (): UseMutationResult<
	void,
	unknown,
	string
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteStudent,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["students"] });
		},
	});
};
