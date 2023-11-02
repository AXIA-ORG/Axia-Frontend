import { Organization } from "./organization.types";
import { Task } from "./task.types";

export interface Epoch {
  id: string;
  duration: number;
  startDate : Date;
  endDate : Date;
  description : string;
  organization: Organization;
  tasks: Task[];
}