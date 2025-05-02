import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

interface DraggableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A reusable draggable item component for use with @dnd-kit
 */
const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  children,
  className = '',
  style = {},
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const itemStyle: React.CSSProperties = {
    ...style,
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease, opacity 200ms ease',
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 999 : 'auto',
    cursor: 'grab',
    // Add a slight rotation effect when dragging
    rotate: isDragging ? '1deg' : '0deg',
    // Add shadow when dragging
    boxShadow: isDragging 
      ? '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' 
      : style.boxShadow || 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={itemStyle}
      className={`draggable-item mb-3 ${className} ${isDragging ? 'is-dragging' : ''}`}
      {...attributes}
      {...listeners}
      aria-roledescription="Draggable item"
      aria-grabbed={isDragging}
    >
      {/* Visual indicator for draggable items */}
      <div 
        className="drag-handle" 
        style={{ 
          position: 'absolute', 
          top: '0.5rem', 
          right: '0.5rem',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#6c757d',
          opacity: 0.5,
          transition: 'opacity 0.2s ease',
          pointerEvents: 'none'
        }}
      />
      {children}
    </div>
  );
};

export default DraggableItem; 