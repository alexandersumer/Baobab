const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default reorder;

export const reorderCardMap = ({ cardMap, source, destination }) => {
  const current = [...cardMap[source.droppableId]];
  const next = [...cardMap[destination.droppableId]];
  const target = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered = reorder(current, source.index, destination.index);
    const result = {
      ...cardMap,
      [source.droppableId]: reordered
    };
    return {
      cardMap: result
    };
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result = {
    ...cardMap,
    [source.droppableId]: current,
    [destination.droppableId]: next
  };

  return {
    cardMap: result
  };
};

export function moveBetween({ list1, list2, source, destination }) {
  const newFirst = list1.values;
  const newSecond = list2.values;

  const moveFrom = source.droppableId === list1.id ? newFirst : newSecond;
  const moveTo = moveFrom === newFirst ? newSecond : newFirst;

  const [moved] = moveFrom.splice(source.index, 1);
  moveTo.splice(destination.index, 0, moved);

  return {
    list1: {
      ...list1,
      values: newFirst
    },
    list2: {
      ...list2,
      values: newSecond
    }
  };
}
