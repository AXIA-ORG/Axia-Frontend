import { ColumnType, TaskStatus } from "../enums/enums";

export interface TaskModel {
  id: string;
  title: string;
  column: ColumnType;
  color: string;
  category: string;
  description?: string;
  status?: TaskStatus; 
  value?: number;
  owner?: string;
  createdAt?: string;
  priority?: string;
}