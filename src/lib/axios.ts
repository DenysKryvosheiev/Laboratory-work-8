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
