import {
    DragEndEvent,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

/**
 * Get sensors for drag and drop with minimum distance constraint
 */
export function useDragSensors(distance = 5) {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance,
      },
    })
  );
}

/**
 * Find an item in an array of items based on its ID
 */
export function findItemById<T>(items: T[], id: string, getItemId: (item: T) => string): T | undefined {
  return items.find(item => getItemId(item) === id);
}

/**
 * Move an item from one container to another
 */
export function moveItemBetweenContainers<T>(
  containers: Record<string, T[]>,
  sourceContainer: string,
  destinationContainer: string,
  itemId: string,
  getItemId: (item: T) => string
): Record<string, T[]> {
  // Don't do anything if source and destination are the same
  if (sourceContainer === destinationContainer) {
    return containers;
  }

  // Find the item being moved
  const sourceItems = containers[sourceContainer];
  const item = findItemById(sourceItems, itemId, getItemId);

  if (!item) {
    console.error(`Could not find item with ID ${itemId} in container ${sourceContainer}`);
    return containers;
  }

  // Create a new containers object with the item moved
  return {
    ...containers,
    [sourceContainer]: containers[sourceContainer].filter(
      item => getItemId(item) !== itemId
    ),
    [destinationContainer]: [...containers[destinationContainer], item],
  };
}

/**
 * Reorder items within the same container
 */
export function reorderItemsInContainer<T>(
  containers: Record<string, T[]>,
  containerId: string,
  activeIndex: number,
  overIndex: number
): Record<string, T[]> {
  return {
    ...containers,
    [containerId]: arrayMove(containers[containerId], activeIndex, overIndex),
  };
}

/**
 * Extract item ID from a drag event
 */
export function getItemId(event: DragEndEvent | DragStartEvent): string {
  return event.active.id.toString();
}

/**
 * Extract container info from a drag event
 */
export function getContainerInfo(event: DragEndEvent) {
  const { active, over } = event;
  
  if (!active || !over) {
    return { 
      sourceContainer: null, 
      destinationContainer: null,
      success: false 
    };
  }

  // Get the container IDs - this assumes containers have data attributes with containerIds
  const sourceContainer = active.data.current?.sortable?.containerId;
  const destinationContainer = over.data.current?.sortable?.containerId;

  if (!sourceContainer || !destinationContainer) {
    return { 
      sourceContainer: null, 
      destinationContainer: null, 
      success: false 
    };
  }

  return {
    sourceContainer,
    destinationContainer,
    success: true
  };
} 