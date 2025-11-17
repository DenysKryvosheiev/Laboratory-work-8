export interface Student {
	id: number;
	firstName: string;
	lastName: string;
	middleName: string;
	phoneNumber: string;
	studentCardNumber: string;
	birthDate: string;
	registrationDate: string;
	benefits?: string | null;
}
