import { createFileRoute } from "@tanstack/react-router";
import { HistoryListPage } from "@/features/history/pages/HistoryListPage";

export const Route = createFileRoute("/history/")({
	component: HistoryListPage,
});
