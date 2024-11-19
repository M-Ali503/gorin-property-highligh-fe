"use client";
import { useState, useEffect } from "react";
// import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axiosInstance from '../lib/axiosInstance'

export default function Home() {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    try {
      const { data } = await axiosInstance.get("/api/highlights");
      setHighlights(data);
    } catch (error) {
      console.error("Error fetching highlights", error);
    } finally {
      setLoading(false);
    }
  };

  const addHighlight = async () => {
    const newHighlight = { text: "", order: highlights.length };
    try {
      const { data } = await axiosInstance.post("/api/highlights", newHighlight);
      setHighlights([...highlights, data]);
    } catch (error) {
      console.error("Error adding highlight", error);
    }
  };

  const updateHighlight = async (id, updatedText) => {
    try {
      await axiosInstance.patch(`/api/highlights/${id}`, { text: updatedText });
      setHighlights(
        highlights.map((h) => (h.id === id ? { ...h, text: updatedText } : h))
      );
    } catch (error) {
      console.error("Error updating highlight", error);
    }
  };

  const deleteHighlight = async (id) => {
    try {
      await axiosInstance.delete(`/api/highlights/${id}`);
      setHighlights(highlights.filter((h) => h.id !== id));
    } catch (error) {
      console.error("Error deleting highlight", error);
    }
  };

  const reorderHighlights = async (result) => {
    if (!result.destination) return;

    const items = Array.from(highlights);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    try {
      await axiosInstance.post("/api/highlights/reorder", items);
      setHighlights(items);
    } catch (error) {
      console.error("Error reordering highlights", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Property Highlights</h1>
      <button onClick={addHighlight}>Add Highlight</button>
      <DragDropContext onDragEnd={reorderHighlights}>
        <Droppable droppableId="highlights">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {highlights.map((highlight, index) => (
                <Draggable
                  key={highlight.id}
                  draggableId={highlight.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <input
                        type="text"
                        value={highlight.text}
                        onChange={(e) =>
                          updateHighlight(highlight.id, e.target.value)
                        }
                      />
                      <button onClick={() => deleteHighlight(highlight.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
