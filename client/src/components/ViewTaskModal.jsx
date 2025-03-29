import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal, Stack, Form } from "react-bootstrap";
import toast from "react-hot-toast";

const ViewTaskModal = ({ showViewModal, handleViewModalClose, id }) => {
  const [task, setTask] = useState(null);

  useEffect(() => {
    const getSingleTask = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/task/single/${id}`, {
          withCredentials: true,
        });
        setTask(res.data.task);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching task data");
      }
    };
    if (id) {
      getSingleTask();
    }
  }, [id]);

  return (
    <Modal
      show={showViewModal}
      onHide={handleViewModalClose}
      size="lg"
      centered
      aria-labelledby="viewTaskModalLabel"
    >
      <Modal.Header closeButton>
        <Modal.Title id="viewTaskModalLabel">View Task</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {task ? (
          <Stack gap={3}>
            <div>
              <h5>Title</h5>
              <p>{task.title}</p>
            </div>

            <div>
              <h5>Description</h5>
              <p>{task.description}</p>
            </div>

            <div>
              <h5>Status</h5>
              <p>
                <strong>{task.status}</strong>
              </p>
            </div>

            <div>
              <h5>Archived</h5>
              <p>
                <strong>{task.archived ? "Yes" : "No"}</strong>
              </p>
            </div>
          </Stack>
        ) : (
          <p>Loading...</p> // Display loading text while fetching task data
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleViewModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewTaskModal;

