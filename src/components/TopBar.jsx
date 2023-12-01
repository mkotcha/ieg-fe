import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const TopBar = () => {
  return (
    <div className="bg-body-tertiary">
      <Container fluid>
        <Row>
          <Col xs={12} md={10} className="mx-auto">
            <Navbar expand="md" className="bg-body-tertiary">
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <div>
                <Navbar.Collapse id="basic-navbar-nav">
                  <NavLink className="navbar-brand" to="/">
                    IEG
                  </NavLink>
                  <Nav className="me-auto">
                    <NavLink to={"/"} className="nav-link">
                      Home
                    </NavLink>
                    <NavLink to={"/login"} className="nav-link">
                      Login
                    </NavLink>
                  </Nav>
                </Navbar.Collapse>
              </div>
            </Navbar>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TopBar;
