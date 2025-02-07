import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

function Navigation() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">MOVIIEBOOKING</Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="/">Accueil</Nav.Link>
          <Nav.Link href="/login">Se connecter</Nav.Link>
          <Nav.Link href="/reservation">Réservation</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navigation;
