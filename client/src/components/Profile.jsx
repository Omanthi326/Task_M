import React, { useState } from "react";
import { Container, Stack, Card, Button, Form } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = ({ user, isAuthenticated, setUser }) => {
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar?.url || "", // Initialize avatar URL for preview
    avatarFile: null, // For handling avatar file uploads
  });

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditedUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar?.url || "",
      avatarFile: null, // Reset avatar file
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedUser((prev) => ({
        ...prev,
        avatarFile: file, // Save the file for upload
        avatar: URL.createObjectURL(file), // For preview purposes
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", editedUser.name);
    formData.append("email", editedUser.email);
    formData.append("phone", editedUser.phone);

    // Only append avatar if there's a file selected
    if (editedUser.avatarFile) {
      formData.append("avatar", editedUser.avatarFile);
    }

    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/user/update`, // Make sure this endpoint exists
        formData,
        { withCredentials: true }
      );

      toast.success("Profile updated successfully");

      // Update the parent component's user state if the profile update is successful
      setUser((prevUser) => ({
        ...prevUser,
        name: editedUser.name,
        email: editedUser.email,
        phone: editedUser.phone,
        avatar: response.data.avatar, // Assuming the updated avatar URL is in the response
      }));

      setEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4 text-primary">Profile</h1>

      {user && (
        <Card className="shadow-sm border-0 rounded-lg p-4">
          <Stack direction="vertical" gap={4} className="align-items-center">
            {/* Profile Image Section */}
            <div className="text-center">
              <img
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  border: "5px solid #00bcd4",
                  objectFit: "cover",
                }}
                src={editedUser.avatar || user.avatar?.url}
                alt="User Avatar"
              />
            </div>

            {/* Edit Profile Form */}
            {editing ? (
              <Form onSubmit={handleSubmit} className="w-100">
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={editedUser.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formAvatar">
                  <Form.Label>Avatar</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-center gap-3 mt-4">
                  <Button variant="secondary" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="success">
                    Save Changes
                  </Button>
                </div>
              </Form>
            ) : (
              <div className="text-center">
                <h4 className="fw-bold">{user.name}</h4>
                <p className="text-muted">{user.email}</p>
                <p className="text-muted">{user.phone}</p>
              </div>
            )}
          </Stack>
        </Card>
      )}
    </Container>
  );
};

export default Profile;
