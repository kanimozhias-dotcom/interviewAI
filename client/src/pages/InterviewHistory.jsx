import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function InterviewHistory() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reports`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      const data = await res.json();

      console.log(data);

      if (data.success) {
        setReports(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchReports();
}, []);
  
  const filteredReports = reports.filter((report) => {
  const matchesDifficulty =
    filter === "All"
      ? true
      : report.difficulty &&
        report.difficulty.toLowerCase().includes(filter.toLowerCase());

  const matchesSearch =
    report.role &&
    report.role.toLowerCase().includes(search.toLowerCase());

  return matchesDifficulty && matchesSearch;
});

const totalInterviews = filteredReports.length;

const averageScore =
  totalInterviews > 0
    ? Math.round(
        filteredReports.reduce((sum, r) => sum + r.overallScore, 0) /
          totalInterviews
      )
    : 0;

const bestScore =
  totalInterviews > 0
    ? Math.max(...filteredReports.map((r) => r.overallScore))
    : 0;

  const getScoreColor = (score) => {
    if (score >= 80) return "#22c55e";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
  };

  

  return (
    <div style={styles.container}>

      <button
        style={styles.backBtn}
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <h1 style={styles.heading}>
        Interview History
      </h1>

<div style={styles.statsDashboard}>

  <div style={styles.summaryCard}>
    <div style={styles.iconBoxBlue}>
      📊
    </div>

    <div>
      <p style={styles.cardTitle}>Total Interviews</p>
      <h2 style={styles.cardValueWhite}>{totalInterviews}</h2>
    </div>
  </div>

  <div style={styles.summaryCard}>
    <div style={styles.iconBoxPurple}>
      ⭐
    </div>

    <div>
      <p style={styles.cardTitle}>Average Score</p>
      <h2 style={styles.cardValuePurple}>
        {averageScore}%
      </h2>
    </div>
  </div>

  <div style={styles.summaryCard}>
    <div style={styles.iconBoxGreen}>
      🏆
    </div>

    <div>
      <p style={styles.cardTitle}>Best Score</p>
      <h2 style={styles.cardValueGreen}>
        {bestScore}%
      </h2>
    </div>
  </div>

</div>
<div style={styles.searchContainer}>
  <input
    type="text"
    placeholder="Search by role..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={styles.searchInput}
  />
</div>

<div style={styles.filterContainer}>

  <button
    style={filter === "All" ? styles.activeFilter : styles.filterBtn}
    onClick={() => setFilter("All")}
  >
    All
  </button>

  <button
    style={filter === "Entry-Level" ? styles.activeFilter : styles.filterBtn}
    onClick={() => setFilter("Entry-Level")}
  >
    Entry
  </button>

  <button
    style={filter === "Mid-Level" ? styles.activeFilter : styles.filterBtn}
    onClick={() => setFilter("Mid-Level")}
  >
    Mid
  </button>

  <button
    style={filter === "Advanced-Level" ? styles.activeFilter : styles.filterBtn}
    onClick={() => setFilter("Advanced-Level")}
  >
    Senior
  </button>

</div>
      {filteredReports.map((report) => (

        <div
          key={report._id}
          style={styles.card}
        >

          <div style={styles.topSection}>

            <div>

              <h2 style={styles.role}>
                💼 {report.role}
              </h2>

              <span style={styles.badge}>
                {report.difficulty}
              </span>

            </div>

            <div style={styles.date}>
              📅 {new Date(report.createdAt).toLocaleString()}
            </div>

          </div>

          <div style={styles.stats}>

            <div>

              <p style={{ color: "#9CA3AF", marginBottom: "8px" }}>
  Overall Score
</p>

              <h3
                style={{
                  color: getScoreColor(report.overallScore)
                }}
              >
                {report.overallScore}%
              </h3>

            </div>

            <div>

              <p style={{ color: "#9CA3AF", marginBottom: "8px" }}>
  Communication
</p>

              <h3
                style={{
                  color: getScoreColor(report.communicationScore)
                }}
              >
                {report.communicationScore}%
              </h3>

            </div>

            <div>

             <p style={{ color: "#9CA3AF", marginBottom: "8px" }}>
  Technical
</p>

              <h3
                style={{
                  color: getScoreColor(report.technicalScore)
                }}
              >
                {report.technicalScore}%
              </h3>

            </div>

            <div>

              <p style={{ color: "#9CA3AF", marginBottom: "8px" }}>
  Confidence
</p>

              <h3
                style={{
                  color: getScoreColor(report.confidenceScore)
                }}
              >
                {report.confidenceScore}%
              </h3>

            </div>

            <div>

              <p style={{ color: "#9CA3AF", marginBottom: "8px" }}>
  Questions
</p>

              <h3>
                {report.questionsAnswered}/{report.questionsAttempted}
              </h3>

            </div>

          </div>

          <div style={styles.buttonContainer}>
<button
  style={styles.detailsBtn}
  onClick={() => navigate(`/results/${report.sessionId}`)}
>
  View Details →
</button>
</div>

        </div>

      ))}

    </div>
  );
}

const styles = {
  container: {
  minHeight: "100vh",
  background: "#0b1023",
  padding: "20px",
  fontFamily: "'Inter', sans-serif",
},

  backBtn: {
    background: "transparent",
    color: "#9ca3af",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    marginBottom: "30px",
    transition: "0.3s",
  },

  heading: {
  color: "white",
  textAlign: "center",
  fontSize: "clamp(28px, 5vw, 42px)",
  fontWeight: "700",
  marginBottom: "35px",
},
  
  statsDashboard: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "35px",
},

summaryCard: {
  background: "#12182c",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: "18px",
  padding: "22px 26px",
  display: "flex",
  alignItems: "center",
  gap: "18px",
  boxShadow: "0 8px 25px rgba(0,0,0,.25)",
},

searchContainer: {
  marginBottom: "20px",
},

searchInput: {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,.15)",
  background: "#12182c",
  color: "#fff",
  fontSize: "16px",
  outline: "none",
},

filterContainer: {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "35px",
  flexWrap: "wrap",
},

filterBtn: {
  background: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,.15)",
  padding: "12px 28px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "16px",
  transition: ".3s",
},

activeFilter: {
  background: "linear-gradient(90deg,#5B4BFF,#8B3DFF)",
  color: "#fff",
  border: "none",
  padding: "12px 28px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "16px",
  boxShadow: "0 10px 25px rgba(91,75,255,.35)",
},
  card: {
    background: "#161c2d",
    borderRadius: "22px",
    padding: "30px",
    marginBottom: "28px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 15px 35px rgba(0,0,0,.35)",
    transition: "all .3s ease",
  },

  topSection: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: "15px",
  marginBottom: "28px",
},

  role: {
  color: "white",
  fontSize: "clamp(22px, 4vw, 28px)",
  marginBottom: "12px",
},

  badge: {
    background: "rgba(110,86,207,.25)",
    color: "#a78bfa",
    padding: "8px 18px",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "14px",
  },

  date: {
    color: "#9ca3af",
    fontSize: "16px",
  },

  stats: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "18px",
  marginBottom: "25px",
},

  buttonContainer: {
  display: "flex",
  justifyContent: "center",
  marginTop: "25px",
  flexWrap: "wrap",
},

  detailsBtn: {
    background: "linear-gradient(90deg,#5B4BFF,#8B3DFF)",
    color: "white",
    border: "none",
    padding: "14px 30px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "0.3s",
  },
};

export default InterviewHistory;