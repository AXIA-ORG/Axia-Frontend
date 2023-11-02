import { User } from "./user.types";

export interface Task {
  id: string;
  title: string;
  description: string;
  status : string;
  value: number;
  createdAt: Date;
  depending?: Task;
  users : User[];
}
