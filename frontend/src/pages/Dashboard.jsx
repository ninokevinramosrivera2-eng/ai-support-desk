import { useEffect, useState } from "react";
import "./Dashboard.css";

const API_URL = "http://127.0.0.1:8000";

function Dashboard({ onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  const [loadingTickets, setLoadingTickets] = useState(true);
  const [creating, setCreating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  async function loadTickets() {
    setLoadingTickets(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/tickets`, {
        headers: authHeaders,
      });

      if (response.status === 401) {
        onLogout();
        return;
      }

      if (!response.ok) {
        throw new Error("Could not load tickets.");
      }

      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingTickets(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function createTicket(event) {
    event.preventDefault();

    setCreating(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Could not create ticket.");
      }

      const newTicket = await response.json();

      setTickets((current) => [newTicket, ...current]);
      setSelectedTicket(newTicket);

      setTitle("");
      setDescription("");
      setPriority("medium");
      setAnalysis(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function analyzeTicket(ticket) {
    setSelectedTicket(ticket);
    setAnalysis(null);
    setAnalyzing(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/tickets/${ticket.id}/ai-analyze`,
        {
          method: "POST",
          headers: authHeaders,
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.detail || "Could not analyze ticket."
        );
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  }

  function priorityClass(value) {
    return `priority priority-${value}`;
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">AI</div>

          <div>
            <h2>AI Support Desk</h2>
            <p>Support workspace</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            Dashboard
          </button>

          <button className="nav-item">
            Tickets
          </button>

          <button className="nav-item">
            AI Analysis
          </button>
        </nav>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Support Dashboard</h1>
            <p>
              Manage customer requests and analyze them
              with AI.
            </p>
          </div>

          <div className="status-badge">
            API Connected
          </div>
        </header>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Tickets</span>
            <strong>{tickets.length}</strong>
          </div>

          <div className="stat-card">
            <span>Open</span>
            <strong>
              {
                tickets.filter(
                  (ticket) => ticket.status === "open"
                ).length
              }
            </strong>
          </div>

          <div className="stat-card">
            <span>High Priority</span>
            <strong>
              {
                tickets.filter(
                  (ticket) => ticket.priority === "high"
                ).length
              }
            </strong>
          </div>

          <div className="stat-card">
            <span>AI Ready</span>
            <strong>Yes</strong>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="panel create-panel">
            <div className="panel-header">
              <div>
                <h3>Create Ticket</h3>
                <p>Add a new customer support request.</p>
              </div>
            </div>

            <form
              className="ticket-form"
              onSubmit={createTicket}
            >
              <div className="form-field">
                <label>Title</label>

                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Example: Cannot access account"
                  required
                />
              </div>

              <div className="form-field">
                <label>Description</label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe the customer issue..."
                  rows="5"
                  required
                />
              </div>

              <div className="form-field">
                <label>Priority</label>

                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value)
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={creating}
              >
                {creating
                  ? "Creating..."
                  : "Create Ticket"}
              </button>
            </form>
          </div>

          <div className="panel tickets-panel">
            <div className="panel-header">
              <div>
                <h3>Recent Tickets</h3>
                <p>Your current support requests.</p>
              </div>

              <button
                className="secondary-button"
                onClick={loadTickets}
              >
                Refresh
              </button>
            </div>

            {loadingTickets ? (
              <div className="empty-state">
                Loading tickets...
              </div>
            ) : tickets.length === 0 ? (
              <div className="empty-state">
                No tickets yet.
              </div>
            ) : (
              <div className="ticket-list">
                {tickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    className={`ticket-item ${
                      selectedTicket?.id === ticket.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setAnalysis(null);
                    }}
                  >
                    <div className="ticket-item-top">
                      <strong>{ticket.title}</strong>

                      <span
                        className={priorityClass(
                          ticket.priority
                        )}
                      >
                        {ticket.priority}
                      </span>
                    </div>

                    <p>{ticket.description}</p>

                    <div className="ticket-meta">
                      <span>#{ticket.id}</span>
                      <span>{ticket.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="panel analysis-panel">
          <div className="panel-header">
            <div>
              <h3>AI Ticket Analysis</h3>
              <p>
                Classify, summarize and generate a
                suggested response.
              </p>
            </div>

            {selectedTicket && (
              <button
                className="primary-button"
                onClick={() =>
                  analyzeTicket(selectedTicket)
                }
                disabled={analyzing}
              >
                {analyzing
                  ? "Analyzing..."
                  : "Analyze with AI"}
              </button>
            )}
          </div>

          {!selectedTicket ? (
            <div className="empty-state large">
              Select a ticket to analyze it.
            </div>
          ) : !analysis ? (
            <div className="selected-ticket">
              <h4>{selectedTicket.title}</h4>

              <p>{selectedTicket.description}</p>

              <div className="selected-ticket-footer">
                <span
                  className={priorityClass(
                    selectedTicket.priority
                  )}
                >
                  {selectedTicket.priority}
                </span>

                <span>
                  Status: {selectedTicket.status}
                </span>
              </div>
            </div>
          ) : (
            <div className="analysis-content">
              <div className="analysis-grid">
                <div className="analysis-card">
                  <span>Category</span>
                  <strong>{analysis.category}</strong>
                </div>

                <div className="analysis-card">
                  <span>Urgency</span>
                  <strong>{analysis.urgency}</strong>
                </div>

                <div className="analysis-card">
                  <span>Sentiment</span>
                  <strong>{analysis.sentiment}</strong>
                </div>
              </div>

              <div className="analysis-section">
                <span>Summary</span>
                <p>{analysis.summary}</p>
              </div>

              <div className="analysis-section response-box">
                <span>Suggested Response</span>
                <p>{analysis.suggested_response}</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;