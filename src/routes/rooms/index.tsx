import { createFileRoute } from "@tanstack/react-router";
import RoomsListPage from "@/features/rooms/pages/RoomsListPage";

export const Route = createFileRoute("/rooms/")({
	component: RoomsListPage,
});
