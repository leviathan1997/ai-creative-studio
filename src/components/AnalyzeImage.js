import React, { useState } from 'react';
import { Container, Form, Button, Spinner, Alert, Image, Row, Col } from 'react-bootstrap';

function AnalyzeImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
    setAnalysisResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('prompt', prompt);

    try {
      const response = await fetch('http://localhost:8000/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze image.');
      }

      const data = await response.json();
      if (data.text) {
        setAnalysisResult(data.text);
      } else {
        setError('No analysis text received, but request was successful.');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 p-4 shadow-lg rounded-3 glassmorphism-card">
      <h2 className="text-center mb-4 text-light fw-bold">Analyze Image Content</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label className="fw-bold text-light">Upload an image to analyze:</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleFileChange} required className="shadow-sm" />
        </Form.Group>

        {previewImage && (
          <div className="mb-3 text-center p-3 border rounded-3 glassmorphism-card-inner shadow-sm">
            <h4 className="mb-3 text-light">Image Preview:</h4>
            <Image src={previewImage} alt="Preview" fluid rounded style={{ maxWidth: '400px', maxHeight: '300px' }} />
          </div>
        )}

        <Form.Group className="mb-3" controlId="analysisPrompt">
          <Form.Label className="fw-bold text-light">Enter your analysis prompt (optional):</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Describe this image in detail, or What is the main subject? (Leave blank for general description)"
            className="shadow-sm"
          />
        </Form.Group>
        <Button variant="info" type="submit" disabled={loading || !selectedFile} className="w-100 py-2">
          {loading ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Analyzing...</> : 'Analyze Image'}
        </Button>
      </Form>

      {error && <Alert variant="danger" className="mt-4 shadow-sm">{error}</Alert>}

      {analysisResult && (
        <div className="mt-4 p-3 border rounded-3 glassmorphism-card-inner shadow-sm">
          <h3 className="mb-3 text-light">Analysis Result:</h3>
          <Alert variant="success" className="mb-0">{analysisResult}</Alert>
        </div>
      )}
    </Container>
  );
}

export default AnalyzeImage;
