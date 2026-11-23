import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Nav, NavDropdown, Navbar, Row } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { setRuoloAction, unsetTokenAction } from "../redux/actions";
import { useAppDispatch, useAppSelector, useIsAdmin } from "../redux/hooks";
import type { Utente } from "../types";
import DumpDb from "./DumpDb";
import CambioPasswordModal from "./modals/CambioPasswordModal";

const TopBar = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const token = useAppSelector(state => state.auth.token);
  const isAdmin = useIsAdmin();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [utente, setUtente] = useState<Utente | null>(null);
  const [showCambioPassword, setShowCambioPassword] = useState(false);

  // a ogni avvio (e dopo il login) rilegge l'utente: aggiorna il ruolo se un ADMIN l'ha cambiato e fa
  // uscire chi ha un token non più valido (scaduto o utente eliminato)
  useEffect(() => {
    if (!token) {
      setUtente(null);
      return;
    }
    const fetchMe = async () => {
      try {
        const response = await axios.get<Utente>(`${import.meta.env.VITE_REACT_APP_API_URL}/utenti/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUtente(response.data);
        dispatch(setRuoloAction(response.data.ruolo));
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) dispatch(unsetTokenAction());
      }
    };
    fetchMe();
  }, [token, dispatch]);

  const handleLogout = () => {
    dispatch(unsetTokenAction());
    navigate("/");
  };

  return (
    <div className="bg-body-tertiary">
      <Container fluid>
        <Row>
          <Col className="mx-auto">
            <Navbar expand="md" className="bg-body-tertiary">
              {/* prima del login solo il marchio: i menu portano a pagine che richiedono l'accesso */}
              {isAuthenticated ? (
                <>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-3" />
                  <div>
                    <Navbar.Collapse id="basic-navbar-nav">
                      <NavLink className="navbar-brand" to="/">
                        IEG
                      </NavLink>
                      <Nav className="me-auto">
                        <NavLink to={"/"} className="nav-link">
                          Home
                        </NavLink>
                        <NavLink to={"/clienti"} className="nav-link">
                          Clienti
                        </NavLink>
                        <NavLink to={"/forniture"} className="nav-link">
                          Forniture
                        </NavLink>
                        <NavLink to={"/fatture"} className="nav-link">
                          Fatture
                        </NavLink>
                        <NavLink to={"/letture"} className="nav-link">
                          Letture
                        </NavLink>
                        <NavLink to={"/oneri"} className="nav-link">
                          Oneri
                        </NavLink>
                        <NavLink to={"/offerte"} className="nav-link">
                          Offerte
                        </NavLink>
                        <NavLink to={"/altre-partite"} className="nav-link">
                          Altre partite
                        </NavLink>
                        {isAdmin && (
                          <NavLink to={"/utenti"} className="nav-link">
                            Utenti
                          </NavLink>
                        )}
                      </Nav>
                    </Navbar.Collapse>
                  </div>
                </>
              ) : (
                <NavLink className="navbar-brand" to="/">
                  IEG
                </NavLink>
              )}
              <div className="ms-auto d-flex align-items-center">
                {isAuthenticated ? (
                  <>
                    {isAdmin && <DumpDb />}
                    <NavDropdown
                      align="end"
                      title={
                        <>
                          <i className="bi bi-person-circle me-1"></i>
                          {utente?.username ?? ""}
                          {!isAdmin && utente && <span className="ms-1 text-secondary small">(sola lettura)</span>}
                        </>
                      }
                      id="menu-utente">
                      <NavDropdown.Item onClick={() => setShowCambioPassword(true)}>Cambia password</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                  </>
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
      <CambioPasswordModal show={showCambioPassword} onHide={() => setShowCambioPassword(false)} />
    </div>
  );
};

export default TopBar;
