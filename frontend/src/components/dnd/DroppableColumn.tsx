import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';

interface DroppableColumnProps<T> {
  id: string;
  title: string;
  items: T[];
  getItemId: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  className?: string;
  emptyStateMessage?: string;
}

/**
 * A reusable droppable column component for Kanban boards
 */
const DroppableColumn = <T,>({
  id,
  title,
  items,
  getItemId,
  renderItem,
  className = '',
  emptyStateMessage = 'Drop items here'
}: DroppableColumnProps<T>) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  // Get all item IDs for the SortableContext
  const itemIds = items.map(getItemId);

  return (
    <div 
      className={`bg-light p-3 rounded h-100 d-flex flex-column ${className}`}
      style={{ 
        minHeight: "300px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        transform: isOver ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isOver 
          ? '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' 
          : '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
      }}
    >
      <h5 className="text-center mb-3 border-bottom pb-2">
        {title}
        <span className="badge bg-secondary ms-2 rounded-pill">{items.length}</span>
      </h5>
      
      <div
        ref={setNodeRef}
        className={`flex-grow-1 ${isOver ? 'bg-light-hover' : ''}`}
        style={{ 
          padding: '0.5rem',
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
          backgroundColor: isOver ? 'rgba(0, 123, 255, 0.05)' : 'transparent',
          borderRadius: '0.25rem'
        }}
      >
        {items.length === 0 ? (
          <div 
            className={`text-muted text-center p-3 rounded ${isOver ? 'border-primary border' : 'border-dashed border'}`}
            style={{ 
              borderWidth: isOver ? '2px' : '1px', 
              transition: 'all 0.2s ease',
              backgroundColor: isOver ? 'rgba(0, 123, 255, 0.05)' : 'transparent'
            }}
          >
            {emptyStateMessage}
          </div>
        ) : (
          <SortableContext 
            items={itemIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="d-flex flex-column gap-2">
              {items.map(item => renderItem(item))}
            </div>
          </SortableContext>
        )}
      </div>

      <div className="mt-2 text-center">
        <small className="text-muted">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </small>
      </div>
    </div>
  );
};

export default DroppableColumn; 