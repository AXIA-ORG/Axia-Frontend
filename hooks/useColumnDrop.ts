import { useDrop } from 'react-dnd';
import { ColumnType, ItemType } from '../enums/enums';
import { TaskModel } from '../models/taskModel';
import { DragItem } from '../models/models';

function useColumnDrop(
  column: string,
  handleDrop: (fromColumn: string, taskId: TaskModel['id']) => void,
) {
  const [{ isOver }, dropRef] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ItemType.TASK,
    drop: (dragItem) => {
      if (!dragItem || dragItem.from === column) {
        return;
      }

      handleDrop(dragItem.from, dragItem.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return {
    isOver,
    dropRef,
  };
}

export default useColumnDrop;
