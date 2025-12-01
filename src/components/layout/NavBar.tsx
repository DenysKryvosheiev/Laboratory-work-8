import { Link, useRouterState } from "@tanstack/react-router";
import type { JSX } from "react";

export function NavBar(): JSX.Element {
	const { location } = useRouterState();

	const linkClasses = (path: string): string =>
		`px-4 py-2 rounded ${
			location.pathname.startsWith(path)
				? "bg-blue-600 text-white"
				: "bg-gray-200 hover:bg-gray-300"
		}`;

	return (
		<nav className="flex gap-4 p-4 border-b bg-white shadow-sm">
			<Link className={linkClasses("/students")} to="/students">
				Студенти
			</Link>

			<Link className={linkClasses("/rooms")} to="/rooms">
				Кімнати
			</Link>

			<Link className={linkClasses("/history")} to="/history">
				Історія проживань
			</Link>
		</nav>
	);
}
