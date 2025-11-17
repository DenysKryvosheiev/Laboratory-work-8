import { createFileRoute } from "@tanstack/react-router";
import { HistoryEditPage } from "@/features/history/pages/HistoryEditPage";

export const Route = createFileRoute("/history/$historyId")({
	component: HistoryEditPage,
});
