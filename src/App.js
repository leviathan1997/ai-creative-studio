import React, { useState } from 'react';
import { Navbar, Container, Nav, Card, Button, Row, Col } from 'react-bootstrap';
import { FaImage, FaEdit, FaSearch } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import GenerateImage from './components/GenerateImage';
import EditImage from './components/EditImage';
import AnalyzeImage from './components/AnalyzeImage';
import logo from './assets/logo2.png';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'generate':
        return <GenerateImage />;
      case 'edit':
        return <EditImage />;
      case 'analyze':
        return <AnalyzeImage />;
      case 'home':
      default:
        return (
          <>
            {/* Hero Section */}
            <div className="hero-section text-center pt-4 pb-3">
              <img src={logo} alt="Pumpbanana Logo" className="hero-logo mb-3" />
              <h1 className="display-4 fw-bold mb-2">AI-Powered Visuals, Made Easy by Pumpbanana</h1>
            </div>

            {/* Feature Cards - Side by Side */}
            <Row className="g-4 justify-content-center mt-4 mb-5">
              {/* Image Generation Section */}
              <Col lg={4} md={6} sm={10}>
                <Card className="h-100 text-center p-4">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <FaImage size={60} className="mb-3 text-success" />
                      <Card.Title className="fs-3 fw-bold mb-3">Generate Image</Card.Title>
                      <Card.Text className="text-light mb-4">
                        Create unique images from scratch using your text prompts.
                      </Card.Text>
                    </div>
                    <Button variant="success" size="lg" className="w-100 mt-auto" onClick={() => setActiveSection('generate')}>Get Started</Button>
                  </Card.Body>
                </Card>
              </Col>

              {/* Image Editing Section */}
              <Col lg={4} md={6} sm={10}>
                <Card className="h-100 text-center p-4">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <FaEdit size={60} className="mb-3 text-warning" />
                      <Card.Title className="fs-3 fw-bold mb-3">Edit Image</Card.Title>
                      <Card.Text className="text-light mb-4">
                        Transform and enhance your existing images with AI commands.
                      </Card.Text>
                    </div>
                    <Button variant="warning" size="lg" className="w-100 mt-auto" onClick={() => setActiveSection('edit')}>Get Started</Button>
                  </Card.Body>
                </Card>
              </Col>

              {/* Image Analysis Section */}
              <Col lg={4} md={6} sm={10}>
                <Card className="h-100 text-center p-4">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <FaSearch size={60} className="mb-3 text-info" />
                      <Card.Title className="fs-3 fw-bold mb-3">Analyze Image</Card.Title>
                      <Card.Text className="text-light mb-4">
                        Understand the content of your images in detail with AI.
                      </Card.Text>
                    </div>
                    <Button variant="info" size="lg" className="w-100 mt-auto" onClick={() => setActiveSection('analyze')}>Get Started</Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        );
    }
  };

  return (
    <div className="App d-flex flex-column min-vh-100">
      <Navbar expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#home" onClick={() => setActiveSection('home')}>Pumpbanana</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="https://x.com/bananaonpump" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center">
                <FaXTwitter size={24} />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="flex-grow-1 my-5">
        {renderSection()}
      </Container>

      <footer className="text-white text-center py-4 mt-5 shadow-lg">
        <Container>
          <p className="mb-0">Powered by Gemini 2.5 Flash (AKA Nano-banana) | &copy; {new Date().getFullYear()} All Rights Reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

export default App;