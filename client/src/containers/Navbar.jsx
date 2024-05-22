import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useContext } from 'react';

function NavbarComponent() {

    const { user, logout } = useContext(AuthContext);

    return (
        <Navbar expand="lg" className="bg-body-tertiary" style={{ marginBottom: "20px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
            <Container>
                <Navbar.Brand href="/">
                    <img src='/logo.png' width={170}></img>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="https://github.com/kgdn/nawfy" target="_blank">
                            <i className="bi bi-github" style={{ marginRight: '5px' }}></i>
                            GitHub
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        {user ? (
                            <NavDropdown title={user.username} id="basic-nav-dropdown">
                                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                                <NavDropdown.Item href="/login" onClick={logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Nav.Link href="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;