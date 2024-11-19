"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Home = () => {
  const [highlights, setHighlights] = useState([
    "High foot traffic and visibility for retail spaces.",
    "Potential for significant rental income growth due to market demand.",
    "Attractive lease terms and incentives for new tenants.",
  ]);

  const addHighlight = () => {
    setHighlights([...highlights, ""]);
  };

  const deleteHighlight = (index) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleEdit = (index, value) => {
    const updatedHighlights = [...highlights];
    updatedHighlights[index] = value;
    setHighlights(updatedHighlights);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(highlights);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setHighlights(items);
  };

  return (
    <div className="property-highlights">
      <h3>Property Highlights</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="highlights">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {highlights.map((highlight, index) => (
                <Draggable
                  key={index}
                  draggableId={`highlight-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => handleEdit(index, e.target.value)}
                      />
                      <button onClick={() => deleteHighlight(index)}>
                        Delete
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={addHighlight}>+ Add Highlight</button>
    </div>
  );
};

export default Home;
