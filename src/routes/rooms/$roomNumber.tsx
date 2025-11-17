import { createFileRoute } from "@tanstack/react-router";
import { RoomEditPage } from "@/features/rooms/pages/RoomEditPage";

export const Route = createFileRoute("/rooms/$roomNumber")({
	component: RoomEditPage,
});
