import { createFileRoute } from "@tanstack/react-router";
import { HistoryCreatePage } from "@/features/history/pages/HistoryCreatePage";

export const Route = createFileRoute("/history/new")({
	component: HistoryCreatePage,
});
