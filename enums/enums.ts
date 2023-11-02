export enum CoumnStatus {
  TO_DO = "todo",
  IN_PROGRESS = "inProgress",
  COMPLETED = "completed",
  BLOCKED = "blocked",
}

export enum TaskStatus {
  ACTIVE = "active",
  PROCESS = "process",
  FINISHED = "finished",
  PAUSED = "paused",
}


export enum ColumnType {
  TO_DO = 'Todo',
  IN_PROGRESS = 'In Progress',
  BLOCKED = 'Blocked',
  COMPLETED = 'Completed',
}

export enum ItemType {
  TASK = 'Task',
}

export enum DashboardViewIndex {
  ORGANIZATIONS = 'organizations',
  TASKS = 'tasks',
  INBOX = 'inbox',
  BOOKMARKS = 'bookmarks'
}