import { useLocalStorage } from 'usehooks-ts';

import { v4 as uuidv4 } from 'uuid';
import { ColumnType } from '../enums/enums';
import { TaskModel } from '../models/taskModel';

function useTaskCollection() {
  return useLocalStorage<{
    [key in ColumnType]: TaskModel[];
  }>('tasks', {
    Todo: [
      {
        id: uuidv4(),
        title: 'Task 1',
        column: ColumnType.TO_DO,
        color: 'blue.300',
        category : 'default'
      },
    ],
    'In Progress': [
      {
        id: uuidv4(),
        column: ColumnType.IN_PROGRESS,
        title: 'Task 2',
        color: 'yellow.300',
        category : 'default'
      },
    ],
    Blocked: [
      {
        id: uuidv4(),
        column: ColumnType.BLOCKED,
        title: 'Task 3',
        color: 'red.300',
        category : 'default'
      },
    ],
    Completed: [
      {
        id: uuidv4(),
        column: ColumnType.COMPLETED,
        title: 'Task 4',
        color: 'green.300',
        category : 'default'
      },
    ],
  });
}

export default useTaskCollection;
