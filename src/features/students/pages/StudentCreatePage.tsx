import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useCreateStudent } from "../api/student.api";
import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";

const StudentCreateSchema = z.object({
	firstName: z.string().min(1, "Введіть імʼя"),
	lastName: z.string().min(1, "Введіть прізвище"),
	middleName: z.string().min(1, "Введіть по батькові"),

	phoneNumber: z.string().min(7, "Телефон надто короткий"),
	studentCardNumber: z.string().min(1, "Введіть номер квитка"),

	birthDate: z.string().min(1, "Оберіть дату народження"),
	registrationDate: z.string().min(1, "Оберіть дату реєстрації"),

	benefits: z.string().nullable(),
});

type StudentCreateForm = z.infer<typeof StudentCreateSchema>;

export function StudentCreatePage(): JSX.Element {
	const navigate = useNavigate();
	const createStudentMutation = useCreateStudent();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<StudentCreateForm>({
		resolver: zodResolver(StudentCreateSchema),
		defaultValues: {
			registrationDate: new Date().toISOString().slice(0, 10),
			benefits: null,
			middleName: "",
		},
	});


	const onSubmit: SubmitHandler<StudentCreateForm> = async (data) => {
		await createStudentMutation.mutateAsync(data);
		void navigate({ to: "/students" });
	};

	return (
		<div className="p-6 max-w-xl mx-auto space-y-4">
			<h1 className="text-2xl font-bold">Додати студента</h1>

			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label>Прізвище</label>
					<input className="border p-2 w-full" {...register("lastName")} />
					{errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
				</div>

				<div>
					<label>Імʼя</label>
					<input className="border p-2 w-full" {...register("firstName")} />
					{errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
				</div>

				<div>
					<label>По батькові</label>
					<input className="border p-2 w-full" {...register("middleName")} />
					{errors.middleName && <p className="text-red-500">{errors.middleName.message}</p>}
				</div>

				<div>
					<label>Телефон</label>
					<input className="border p-2 w-full" {...register("phoneNumber")} />
					{errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
				</div>

				<div>
					<label>Номер студентського квитка</label>
					<input className="border p-2 w-full" {...register("studentCardNumber")} />
					{errors.studentCardNumber && (
						<p className="text-red-500">{errors.studentCardNumber.message}</p>
					)}
				</div>

				<div>
					<label>Дата народження</label>
					<input className="border p-2 w-full" type="date" {...register("birthDate")} />
					{errors.birthDate && <p className="text-red-500">{errors.birthDate.message}</p>}
				</div>

				<div>
					<label>Дата реєстрації</label>
					<input className="border p-2 w-full" type="date" {...register("registrationDate")} />
					{errors.registrationDate && (
						<p className="text-red-500">{errors.registrationDate.message}</p>
					)}
				</div>

				<div>
					<label>Пільги</label>
					<input className="border p-2 w-full" {...register("benefits")} />
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
