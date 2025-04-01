import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Login from "./components/Login";
import Profile from "./components/Profile";
import toast from "react-hot-toast";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const [taskTitle, setTaskTitle] = useState("Tasks");

  // Configure axios defaults
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const handleGetUser = async () => {
      setIsLoading(true);
      try {
        console.log("Checking authentication status...");
        const { data } = await axios.get(
          "http://13.48.137.48:4000/api/v1/user/me",
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
        
        // Only show toast for actual errors, not just for not being logged in
        if (error.response && error.response.status !== 401 && error.response.status !== 400) {
          toast.error("Error checking authentication status");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    handleGetUser();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

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
            element={<Profile user={user} isAuthenticated={isAuthenticated} setUser={setUser} />}
          />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </>
  );
};

export default App;
