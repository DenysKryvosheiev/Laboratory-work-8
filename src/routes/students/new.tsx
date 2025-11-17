import { createFileRoute } from "@tanstack/react-router";
import { StudentCreatePage } from "@/features/students/pages/StudentCreatePage";

export const Route = createFileRoute("/students/new")({
	component: StudentCreatePage,
});
