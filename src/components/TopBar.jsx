import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { unsetTokenAction } from "../redux/actions";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(unsetTokenAction());
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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
                  </Nav>
                </Navbar.Collapse>
              </div>
              <div className="ms-auto">
                {isAuthenticated ? (
                  <NavLink onClick={handleLogout} className="text-decoration-none text-white">
                    Logout
                  </NavLink>
                ) : (
                  <NavLink to={"/login"} className="text-decoration-none text-white">
                    Login
                  </NavLink>
                )}
              </div>
            </Navbar>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TopBar;
