import type { IDoctor } from "./IUser";

export interface IDepartment {
    department_id: number;
    department_name: string;
    description: string;
    doctors?: IDoctor[];
}