import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";

const TaskList = ({ tasks, onEdit, onDelete }) => (
  <Row>
    {tasks.map((task) => (
      <Col key={task._id} xs={12} sm={6} md={4} className="mb-3">
        <Card>
          <Card.Body>
            <Card.Title>{task.title || "Untitled"}</Card.Title>
            <Card.Text className="d-flex">
              <strong className="me-2" style={{ width: "100px" }}>
                Description:
              </strong>
              <span>{task.description}</span>
            </Card.Text>
            <Card.Text className="d-flex">
              <strong className="me-2" style={{ width: "100px" }}>
                Status:
              </strong>
              <span>{task.status}</span>
            </Card.Text>

            <Button
              variant="warning"
              size="sm"
              className="me-2"
              onClick={() => onEdit(task)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(task._id)}
            >
              Delete
            </Button>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);

export default TaskList;
