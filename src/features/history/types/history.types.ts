export interface StudentRoomHistory {
	id: number;
	moveInDate: string;
	moveOutDate: string | null;

	student?: {
		id: number;
		firstName: string;
		lastName: string;
		middleName?: string | null;
	} | null;

	room?: {
		roomNumber: number;
		places: number;
		area: number;
	} | null;
}

export interface CreateStudentRoomHistory {
	student: number;
	room: number;
	moveInDate: string;
	moveOutDate: string | null;
}

export interface UpdateStudentRoomHistory {
	student: number;
	room: number;
	moveInDate: string;
	moveOutDate: string | null;
}
