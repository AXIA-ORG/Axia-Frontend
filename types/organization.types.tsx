import { TaskModel } from "../models/taskModel";
import { Epoch } from "./epoch.types";
import { User } from "./user.types";

export interface Organization {
  id : string;
  name : string;
  description : string;
  moderatorsNumber : number;
  img? : string;
  fieldsBase? : string[];
  users : User[];
  epochs? : Epoch[];
  organizationUsers? : User[];
  baseTasks: TaskModel[];
}