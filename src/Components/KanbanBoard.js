import React, { useState, useEffect } from "react";
import "./KanbanBoard.css";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState("status");
  const [sortOption, setSortOption] = useState("priority");
  const [groupedTickets, setGroupedTickets] = useState({});

  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data.tickets);
        setUsers(data.users);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const groupTickets = (criteria) => {
    const groups = {};
    if (criteria === "status") {
      tickets.forEach((ticket) => {
        groups[ticket.status] = groups[ticket.status] || [];
        groups[ticket.status].push(ticket);
      });
    } else if (criteria === "user") {
      tickets.forEach((ticket) => {
        const userName = users.find((user) => user.id === ticket.userId)?.name || "Unknown";
        groups[userName] = groups[userName] || [];
        groups[userName].push(ticket);
      });
    } else if (criteria === "priority") {
      tickets.forEach((ticket) => {
        const priorityName = ["No priority", "Low", "Medium", "High", "Urgent"][ticket.priority];
        groups[priorityName] = groups[priorityName] || [];
        groups[priorityName].push(ticket);
      });
    }
    setGroupedTickets(groups);
  };

  const sortTickets = (tickets) => {
    if (sortOption === "priority") {
      return tickets.sort((a, b) => b.priority - a.priority);
    } else if (sortOption === "title") {
      return tickets.sort((a, b) => a.title.localeCompare(b.title));
    }
    return tickets;
  };

  useEffect(() => {
    groupTickets(grouping);
  }, [tickets, grouping]);

  return (
    <div className="kanban-board">
      <header>
        <h1>Kanban Board</h1>
        <div className="controls">
          <select onChange={(e) => setGrouping(e.target.value)} value={grouping}>
            <option value="status">Group by Status</option>
            <option value="user">Group by User</option>
            <option value="priority">Group by Priority</option>
          </select>
          <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </header>
      <main className="cardView">
        {Object.keys(groupedTickets).map((group) => (
          <div key={group} className="group">
            <h2>{group}</h2>
            <div className="tickets">
              {sortTickets(groupedTickets[group]).map((ticket) => {
                const user = users.find((user) => user.id === ticket.userId);
                return (
                  <div key={ticket.id} className="card">
                    <h3>{ticket.title}</h3>
                    <p><strong>Status:</strong> {ticket.status}</p>
                    <p>
                      <strong>Priority:</strong> {["No priority", "Low", "Medium", "High", "Urgent"][ticket.priority]}
                    </p>
                    <p>
                      <strong>Assigned to:</strong>{" "}
                      {user ? `${user.name} (${user.available ? "Available" : "Unavailable"})` : "Unknown"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default KanbanBoard;
