import { createFileRoute } from "@tanstack/react-router";
import { RoomCreatePage } from "@/features/rooms/pages/RoomCreatePage";

export const Route = createFileRoute("/rooms/new")({
	component: RoomCreatePage,
});
