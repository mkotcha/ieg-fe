import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loginAction } from "../redux/actions";

const Login = () => {
  const dispatch = useDispatch();

  const handleSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    const username = form.formUsername.value;
    const password = form.formPassword.value;
    dispatch(loginAction(username, password));
  };

  return (
    <div className="h-100 mt-5">
      <Row className="mx-0">
        <Col sm={9} md={6} className="mx-auto">
          <div className=" p-2 p-sm-4 border rounded-4">
            <div className="text-center mb-4">
              <h1>Login</h1>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Row>
                  <Col xs={3} className="text-end my-auto">
                    <Form.Label className="text-nowrap mb-0">Utente</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control type="text" placeholder="nome utente" />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Row>
                  <Col xs={3} className="text-end my-auto">
                    <Form.Label className="text-nowrap mb-0">Password</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control type="password" placeholder="Password" />
                  </Col>
                </Row>
              </Form.Group>
              <Row>
                <Col xs={3} className="text-end my-auto"></Col>
                <Col>
                  <Button variant="primary" type="submit">
                    Accedi
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
