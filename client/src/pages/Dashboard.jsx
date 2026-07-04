import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle
} from "react-icons/fa";
import {
  MdManageAccounts,
  MdLogout
} from "react-icons/md";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function Dashboard() {
const navigate = useNavigate()
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

const [showMenu, setShowMenu] = useState(false)
const [stats, setStats] = useState({
  totalInterviews: 0,
  averageScore: 0,
  bestScore: 0,
  streak: 0,
  lineData: [],
  barData: [],
});

const [user, setUser] = useState({
  name: "",
});

const handleLogout = () => {
localStorage.clear() // Clears stored login data
navigate("/") // Redirects to Login page
}

const fetchStats = async () => {
  try {
    const res = await fetch(
      "http://localhost:5000/api/dashboard/stats",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();

    console.log(data);

    setStats(data);

  } catch (error) {
    console.error(error);
  }
};

const fetchUser = async () => {
  try {
    const res = await fetch(
      "http://localhost:5000/api/auth/me",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      setUser(data.user);
    }

  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchStats();
  fetchUser();
}, []);

const cards = [
{
title: "Start Interview Practice",
desc: "Practice real interview questions with AI simulation",
action: () => navigate("/setup"),
},
{
title: "Interview History",
desc: "View all your previous interviews",
action: () => navigate("/history"),
},
]

return ( <div
  style={{
    ...styles.container,
    padding: isMobile ? "20px" : "40px",
  }}
> <div
  style={{
    ...styles.header,
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "stretch" : "center",
    gap: isMobile ? "20px" : "0px",
  }}
><div> <h1
  style={{
    ...styles.heading,
    fontSize: isMobile ? "30px" : "40px",
  }}
>Dashboard</h1> <p style={styles.subtext}>
Track your progress and continue your preparation </p> </div>

    <div
  style={{
    ...styles.profileContainer,
    alignSelf: isMobile ? "flex-end" : "auto",
  }}
>
  <FaUserCircle
    size={40}
    style={{ cursor: "pointer", color: "#4735e5" }}
    onClick={() => setShowMenu(!showMenu)}
  />

 {showMenu && (
  <div
    style={{
      position: "absolute",
      top: "50px",
      right: 0,
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      width: isMobile ? "140px" : "160px",
      zIndex: 1000,
      overflow: "hidden",
    }}
  >
    <div
  style={{
    padding: "12px 16px",
    color: "black",
    cursor: "pointer",
    borderBottom: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
  onClick={() => navigate("/profile")}
>
  <MdManageAccounts size={20} />
  Edit Profile
</div>

    <div
  style={{
    padding: "12px 16px",
    color: "black",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
  onClick={handleLogout}
>
  <MdLogout size={20} />
  Logout
</div>
  </div>
)}
</div>
</div>

<div style={styles.welcomeCard}>
  <h2
  style={{
    ...styles.welcomeTitle,
    fontSize: isMobile ? "22px" : "28px",
  }}
>
    Welcome, {user.name || "User"} 👋
  </h2>

  <p
  style={{
    ...styles.welcomeText,
    fontSize: isMobile ? "14px" : "15px",
  }}
>
    {stats.totalInterviews === 0
      ? "Start your first AI mock interview and begin your interview preparation journey."
      : "Keep practicing, improve your skills, and track your interview performance over time."}
  </p>
</div>

<div
  style={{
    ...styles.statsGrid,
    gridTemplateColumns:
  isMobile
    ? "1fr"
    : "repeat(auto-fit, minmax(280px, 1fr))",
  }}
>

  <div style={styles.statCard}>
    <div style={styles.statIcon}>🎯</div>
    <h3 style={styles.statNumber}>{stats.totalInterviews}</h3>
    <p style={styles.statLabel}>Interviews</p>
  </div>

  <div style={styles.statCard}>
    <div style={styles.statIcon}>📊</div>
    <h3 style={styles.statNumber}>{stats.averageScore}%</h3>
    <p style={styles.statLabel}>Average Score</p>
  </div>

  <div style={styles.statCard}>
  <div style={styles.statIcon}>🔥</div>
  <h3 style={styles.statNumber}>{stats.streak}</h3>
  <p style={styles.statLabel}>Day Streak</p>
</div>

  <div style={styles.statCard}>
    <div style={styles.statIcon}>🏆</div>
    <h3 style={styles.statNumber}>{stats.bestScore}%</h3>
    <p style={styles.statLabel}>Best Score</p>
  </div>

</div>
  <div
  style={{
    ...styles.statsGrid,
    gridTemplateColumns: isMobile
      ? "repeat(2,1fr)"
      : "repeat(auto-fit,minmax(180px,1fr))",
  }}
>
    {cards.map((card, index) => (
      <div
  key={index}
  style={styles.card}
  onClick={card.action}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-5px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0px)";
  }}
>
        <h2 style={styles.cardTitle}>{card.title}</h2>
        <p style={styles.cardDesc}>{card.desc}</p>
      </div>
    ))}
  </div>
 <div
  style={{
    ...styles.chartCard,
    padding: isMobile ? "15px" : "30px",
  }}
>
  <h2 style={{ color: "white", marginBottom: "25px" }}>
    Performance Overview
  </h2>

  <div
  style={{
    ...styles.chartGrid,
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: isMobile ? "20px" : "30px",
  }}
>

    <div
  style={{
    ...styles.chartBox,
    padding: isMobile ? "12px" : "20px",
  }}
>
      <h3 style={styles.chartTitle}>Interview Progress</h3>

      <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
        <LineChart data={stats.lineData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="interview" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8b5cf6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>

    <div style={styles.chartBox}>
      <h3 style={styles.chartTitle}>Latest Interview</h3>

      <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
        <BarChart data={stats.barData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#8b5cf6" radius={[8,8,0,0]} />
        </BarChart>
      </ResponsiveContainer>

    </div>

  </div>
  </div>
</div>

)
}

const styles = {
container: {
  minHeight: "100vh",
  padding: "40px",
  background: "#0B1020",
  fontFamily: "Arial, sans-serif",
},
header: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: "30px",
},
heading: {
  fontSize: "40px",
  fontWeight: "700",
  marginBottom: "10px",
  color: "white",
},
subtext: {
  fontSize: "17px",
  color: "#94A3B8",
},
profileContainer: {
  position: "relative",
},
chartGrid: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "30px",
},

chartBox: {
  background: "#141b31",
  padding: "20px",
  borderRadius: "14px",
  width: "100%",
  minWidth: 0,
  overflow: "hidden",
},

chartTitle: {
  color: "white",
  marginBottom: "15px",
  textAlign: "center",
},
dropdown: {
  position: "absolute",
  top: "50px",
  right: "0",
  background: "#fff",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
  minWidth: "160px",
  overflow: "hidden",
  zIndex: 1000,
},

menuItem: {
  padding: "12px 16px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
},

grid: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
gap: "20px",
},

card: {
  background: "#141B2D",
  border: "1px solid #2C3652",
  padding: "28px",
  borderRadius: "20px",
  cursor: "pointer",
  transition: "0.3s",
  boxShadow: "0 0 20px rgba(0,0,0,0.2)",
  transform: "translateY(0px)",
},
cardTitle: {
  color: "white",
  fontSize: "22px",
  marginBottom: "12px",
},
cardDesc:{
  color:"#94A3B8",
  fontSize:"15px"
},

welcomeCard: {
  background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
  padding: "25px",
  borderRadius: "20px",
  marginBottom: "25px",
  color: "white",
},

welcomeTitle: {
  fontSize: "28px",
  fontWeight: "700",
  marginBottom: "10px",
},

welcomeText: {
  color: "#E2E8F0",
  fontSize: "15px",
},

statsGrid:{
  display:"grid",
  gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
  gap:"20px",
  marginBottom:"35px",
},

statCard:{
  background:"#141B2D",
  border:"1px solid #2C3652",
  borderRadius:"18px",
  padding:"25px",
  textAlign:"center",
},
statIcon: {
  fontSize: "28px",
  marginBottom: "10px",
},
statNumber:{
  color:"#8B5CF6",
  fontSize:"32px",
  marginBottom:"10px",
},

statLabel:{
  color:"#94A3B8",
  fontSize:"15px",
},

chartCard: {
  marginTop: "35px",
  background: "#141B2D",
  border: "1px solid #2C3652",
  borderRadius: "20px",
  padding: "20px",
},

fakeChart:{
  display:"flex",
  alignItems:"flex-end",
  justifyContent:"space-around",
  height:"220px",
},
}

export default Dashboard
