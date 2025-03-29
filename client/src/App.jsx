import  { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Login from "./components/Login";
import Profile from "./components/Profile";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const [taskTitle, setTaskTitle] = useState("Tasks");

  useEffect(() => {
    const handleGetUser = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/me",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        
        setUser(data.user);
        setIsAuthenticated(true);
        console.log("USER IS AUTHENTICATED");
      } catch (error) {
        console.log("Authentication error:", error);
        setUser({});
        setIsAuthenticated(false);
        console.log("USER IS NOT AUTHENTICATED!");
      }
    };
    handleGetUser();
  }, [isAuthenticated]);

  return (
    <>
      <Router>
        <Navbar
          setTasks={setTasks}
          setIsAuthenticated={setIsAuthenticated}
          isAuthenticated={isAuthenticated}
          setTaskTitle={setTaskTitle}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isAuthenticated={isAuthenticated}
                tasks={tasks}
                setTasks={setTasks}
                taskTitle={taskTitle}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/profile"
            element={<Profile user={user} isAuthenticated={isAuthenticated} />}
          />
        </Routes>
        <Toaster />
      </Router>
    </>
  );
};

export default App;
