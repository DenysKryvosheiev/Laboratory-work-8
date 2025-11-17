import { useParams, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useStudent, useUpdateStudent } from "../api/student.api";
import type { JSX } from "react";
// eslint-disable-next-line no-duplicate-imports
import { useEffect } from "react";

const StudentEditSchema = z.object({
	firstName: z.string().min(1, "Введіть імʼя"),
	lastName: z.string().min(1, "Введіть прізвище"),
	middleName: z.string().optional(),
	phoneNumber: z.string().min(7, "Телефон надто короткий"),
	studentCardNumber: z.string().min(1, "Введіть номер квитка"),
	birthDate: z.string(),
	registrationDate: z.string(),
});

type StudentEditForm = z.infer<typeof StudentEditSchema>;

export function StudentEditPage(): JSX.Element {
	const { studentId } = useParams({ from: "/students/$studentId" });
	const navigate = useNavigate();

	const { data: student, isLoading } = useStudent(studentId);
	const updateStudentMutation = useUpdateStudent();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<StudentEditForm>({
		resolver: zodResolver(StudentEditSchema),
	});

	useEffect(() => {
		if (student) {
			reset(student);
		}
	}, [student, reset]);

	if (isLoading) return <div className="p-4">Завантаження...</div>;

	const onSubmit = async (form: StudentEditForm): Promise<void> => {
		await updateStudentMutation.mutateAsync({
			id: studentId,
			data: form,
		});

		await navigate({ to: "/students" });
	};

	return (
		<div className="p-6 max-w-xl mx-auto space-y-3">
			<h1 className="text-2xl font-bold">Редагувати студента</h1>

			<form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label>Прізвище</label>
					<input {...register("lastName")} className="border p-2 w-full" />
					{errors.lastName && (
						<p className="text-red-500">{errors.lastName.message}</p>
					)}
				</div>

				<div>
					<label>Імʼя</label>
					<input {...register("firstName")} className="border p-2 w-full" />
					{errors.firstName && (
						<p className="text-red-500">{errors.firstName.message}</p>
					)}
				</div>

				<div>
					<label>По батькові</label>
					<input {...register("middleName")} className="border p-2 w-full" />
				</div>

				<div>
					<label>Телефон</label>
					<input {...register("phoneNumber")} className="border p-2 w-full" />
				</div>

				<div>
					<label>Номер студентського квитка</label>
					<input
						{...register("studentCardNumber")}
						className="border p-2 w-full"
					/>
				</div>

				<div>
					<label>Дата народження</label>
					<input type="date" {...register("birthDate")} className="border p-2 w-full" />
				</div>

				<div>
					<label>Дата реєстрації</label>
					<input type="date" {...register("registrationDate")} className="border p-2 w-full" />
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
