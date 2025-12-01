import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { JSX } from "react";
import { NavBar } from "@/components/layout/NavBar";

const queryClient = new QueryClient();

function RootComponent(): JSX.Element {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="min-h-screen bg-gray-50">
				<NavBar />
				<Outlet />
			</div>

			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export const Route = createRootRoute({
	component: RootComponent,
});
