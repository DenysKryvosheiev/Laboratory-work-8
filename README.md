# Лабораторно-практична робота №8
## «Full-stack інтеграція: розробка UI на базі професійного бойлерплейту»
## 1. Короткий опис реалізованого функціоналу

## Реалізовано три основні модулі:

### **Модуль "Студенти"**
- Перегляд списку студентів  
- Створення нового студента  
- Редагування існуючого студента  
- Видалення студента  
- Валідація введених даних через Zod  
- Отримання/оновлення даних через TanStack Query

### **Модуль "Кімнати"**
- Відображення всіх кімнат  
- Створення нової кімнати  
- Редагування кімнати  
- Видалення кімнати  
- Zod-схема валідації для площі та кількості місць

### **Модуль "Історія проживань студентів"**
- Перегляд усіх записів проживань  
- Додавання нового запису (заселення)  
- Редагування існуючого запису  
- Видалення записів історії  
- Передача studentId та roomNumber на бекенд

##  2. Приклади ключового коду

### **Конфігурація Axios**
```
import type { AxiosError } from "axios";
// eslint-disable-next-line no-duplicate-imports
import axios from "axios";

const apiClient = axios.create({
	baseURL: String(import.meta.env["VITE_API_BASE_URL"]),
	headers: {
		"Content-Type": "application/json",
		Authorization: String(import.meta.env["VITE_API_AUTH_TOKEN"]),
	},
});

apiClient.interceptors.response.use(
	(response) => response,
	(error: unknown) => {
		const axiosError = error as AxiosError<{ message?: string }>;

		const status = axiosError.response?.status;
		const message =
			axiosError.response?.data?.message ??
			axiosError.message ??
			"Unknown API error";

		console.error("API ERROR:", { status, message });

		return Promise.reject(axiosError);
	}
);

export default apiClient;
```
### **Хуки для TanStack Query**
Приклад для історії проживань студента
```/history```
```
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
```
### **Zod-схема**
Валідація форми виконується за допомогою Zod-схеми.
Вона перевіряє правильність введених даних ще до надсилання на сервер

Приклад для історії проживань студента
```/history```
```
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
```
## Скріншоти
### Сторінка зі списком сутностей
![img](/img/page_rooms.jpg)
### Форма з помилками валідації від Zod
![img](/img/validation.jpg)
### Вкладка Network
![img](/img/network_info.jpg)

## Коментарі щодо особливостей реалізації та труднощів
### Під час виконання роботи більшість функціональності була реалізована успішно: CRUD-операції для студентів, кімнат та історії проживань, взаємодія з бекендом через Axios, застосування React Hook Form разом із Zod та інтеграція TanStack Query.
### Але виникли проблеми з виконанням завдання 5, через серію типових конфліктів, некоректне повторне рендерення інтерцепторів та проблеми з переадресацією після логіну цю частину було вирішено не включати до фінальної версії, щоб забезпечити стабільність основної функціональності.
