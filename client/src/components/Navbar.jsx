import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function Header({
  setTasks,
  setIsAuthenticated,
  isAuthenticated,
  setTaskTitle,
}) {
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For navigation on unauthorized errors

  // Fetch tasks from the server when the component mounts or auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  // Fetch tasks from the server
  const fetchTasks = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      console.log("Fetching tasks...");
      const response = await axios.get(
        "http://13.48.137.48:4000/api/v1/task/mytask",
        { 
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Tasks fetched successfully:", response.data);
      setAllTasks(response.data.tasks);
      setTasks(response.data.tasks); // Update tasks with fetched tasks
    } catch (error) {
      console.error("Error fetching tasks:", error);
      
      // Handle authentication errors specifically
      if (error.response && (error.response.status === 401 || error.response.status === 400)) {
        toast.error("Session expired. Please log in again.");
        // Force logout on authentication errors
        handleLogout();
      } else {
        toast.error("Failed to fetch tasks. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://13.48.137.48:4000/api/v1/user/logout",
        { 
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      // Clear local tasks state
      setAllTasks([]);
      setTasks([]);
      
      // Set authentication state to false
      setIsAuthenticated(false);
      
      toast.success(data.message || "Logged out successfully");
      navigate("/login"); // Redirect to login page after logging out
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails on server, clear auth state on client
      setIsAuthenticated(false);
      toast.error(error.response?.data?.message || "Logout failed, but session ended");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = (filterType) => {
    let filteredTasks = [];

    switch (filterType) {
      case "completed":
        filteredTasks = allTasks.filter((task) => task.status === "completed");
        setTaskTitle("Completed Tasks");
        break;
      case "incomplete":
        filteredTasks = allTasks.filter((task) => task.status === "incomplete");
        setTaskTitle("Incomplete Tasks");
        break;
      case "archived":
        filteredTasks = allTasks.filter((task) => task.archived === true);
        setTaskTitle("Archived Tasks");
        break;
      case "all":
        filteredTasks = allTasks;
        setTaskTitle("Tasks");
        break;
      default:
        filteredTasks = allTasks;
    }
    setTasks(filteredTasks);
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading while determining authentication status
  }

  return (
    <>
      {/* Inline CSS for Enhanced Navbar */}
      <style>
        {`
          .navbar-custom {
            background-color: #343a40;
            border-radius: 0px;
            padding: 15px 30px;
          }

          .navbar-custom .navbar-nav .nav-link {
            color: #ffffff;
            font-size: 1.1rem;
            margin-right: 20px;
            font-weight: 500;
            padding: 8px 20px;
            border-radius: 30px;
            transition: background-color 0.3s ease;
          }

          .navbar-custom .navbar-nav .nav-link:hover {
            background-color: #00bcd4;
            color: #ffffff;
          }

          .navbar-custom .navbar-nav .active {
            background-color: #0097a7;
            color: #ffffff;
            border-radius: 30px;
          }

          .navbar-custom .navbar-nav .nav-dropdown-item {
            color: #333;
            font-size: 1rem;
          }

          .navbar-custom .navbar-nav .nav-dropdown-item:hover {
            background-color: #00bcd4;
            color: #ffffff;
          }

          .navbar-custom .navbar-brand {
            color: #ffffff;
            font-size: 1.8rem;
            font-weight: 700;
          }

          .navbar-custom .navbar-toggler {
            background-color: #00bcd4;
          }

          .navbar-custom .navbar-toggler-icon {
            background-color: #ffffff;
          }

          .btn-logout {
            background-color: transparent;
            border: none;
            color: #ffffff;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s ease;
            margin-left: 20px;
          }

          .btn-logout:hover {
            background-color: #00bcd4;
            color: #ffffff;
          }
        `}
      </style>

      <Navbar expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand href="#home">TASK MANAGER</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link
                to={"/"}
                className="text-decoration-none d-flex align-items-center nav-link"
              >
                Home
              </Link>
              <NavDropdown
                title="Filter Tasks"
                id="basic-nav-dropdown"
                className="nav-link"
                disabled={loading || !isAuthenticated}
              >
                <NavDropdown.Item
                  onClick={() => filterTasks("all")}
                  className="nav-dropdown-item"
                >
                  All Tasks
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => filterTasks("completed")}
                  className="nav-dropdown-item"
                >
                  Completed Tasks
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => filterTasks("incomplete")}
                  className="nav-dropdown-item"
                >
                  Incomplete Tasks
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => filterTasks("archived")}
                  className="nav-dropdown-item"
                >
                  Archived Tasks
                </NavDropdown.Item>
              </NavDropdown>
              <Link
                to={"/profile"}
                className="text-decoration-none d-flex align-items-center nav-link"
              >
                Profile
              </Link>
              <Button
                className="btn-logout"
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? "Please wait..." : "LOGOUT"}
              </Button>
             
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
