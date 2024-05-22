import NavbarComponent from "../containers/Navbar"
import AccountsAPI from "../api/AccountAPI"
import { Container, Form, Button, Row, Col } from "react-bootstrap"
import { useState } from "react"

function LoginRegis() {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerUserword, setRegisterUserword] = useState("");

    const LoginButton = async () => {
        const response = await AccountsAPI.login(loginUsername, loginPassword);
        if (response.status === 200) {
            window.location.href = "/";
        }
    }

    const RegisterButton = async () => {
        const response = await AccountsAPI.register(registerUsername, registerPassword, registerUserword);
        if (response.status === 200) {
            window.location.href = "/";
        }
    }

    return (
        <div id="login-regis">
            <NavbarComponent />
            <Container>
                <Row className="mt-5">
                    <Col>
                        <h1>Login</h1>
                        <Form onSubmit={(e) => { e.preventDefault(); LoginButton(); }}>
                            <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
                                <Col>
                                    <Form.Control type="text" placeholder="Username" onChange={(e) => setLoginUsername(e.target.value)} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                                <Col>
                                    <Form.Control type="password" placeholder="Password" onChange={(e) => setLoginPassword(e.target.value)} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col>
                                    <Button onClick={LoginButton}>Login</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col>
                        <h1>Register</h1>
                        <Form onSubmit={(e) => { e.preventDefault(); RegisterButton(); }}>
                            <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
                                <Col>
                                    <Form.Control type="text" placeholder="Username" onChange={(e) => setRegisterUsername(e.target.value)} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                                <Col>
                                    <Form.Control type="password" placeholder="Password" onChange={(e) => setRegisterPassword(e.target.value)} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                                <Col>
                                    <Form.Control type="text" placeholder="Userword" onChange={(e) => setRegisterUserword(e.target.value)} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col>
                                    <Button onClick={RegisterButton}>Register</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default LoginRegis;