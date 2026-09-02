"use client";

import type { ReactNode } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";

/**
 * Minimal kanban primitives on @dnd-kit/core only (not @dnd-kit/sortable) —
 * adapted from Opsara's milestones board pattern. A card is draggable, a
 * column is droppable; the parent owns the DndContext and the optimistic
 * status update on drag-end. No sort-within-column, just cross-column moves.
 */

export function DraggableCard({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="kanban-card"
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    >
      {children}
    </div>
  );
}

export function DroppableColumn({
  id,
  label,
  count,
  children,
}: {
  id: string;
  label: string;
  count: number;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={`kanban-column ${isOver ? "kanban-column-over" : ""}`}>
      <div className="kanban-column-head">
        <span>{label}</span>
        <span className="kanban-column-count">{count}</span>
      </div>
      <div className="kanban-column-body">{children}</div>
    </div>
  );
}
