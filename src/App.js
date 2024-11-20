import React, { useState, useEffect } from "react";
import KanbanBoard from "./Components/KanbanBoard";
import "./App.css";

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState("status");
  const [sortBy, setSortBy] = useState("priority");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      }
    };

    fetchTickets();
    const savedGroupBy = localStorage.getItem("groupBy");
    const savedSortBy = localStorage.getItem("sortBy");
    if (savedGroupBy) setGroupBy(savedGroupBy);
    if (savedSortBy) setSortBy(savedSortBy);
  }, []);

  const handleGroupChange = (e) => {
    setGroupBy(e.target.value);
    localStorage.setItem("groupBy", e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    localStorage.setItem("sortBy", e.target.value);
  };

  return (
    <div className="App">
      <KanbanBoard tickets={tickets} groupBy={groupBy} sortBy={sortBy} />
    </div>
  );
};

export default App;
