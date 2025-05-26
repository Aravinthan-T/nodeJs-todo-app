import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

const AppNavbar = ({ onLogout }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>Task Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <NavDropdown title="My Profile" id="profile-dropdown" align="end">
              <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
