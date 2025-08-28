import React, { useState } from 'react';
import { Container, Form, Button, Spinner, Alert, Image } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';

function EditImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [editedImage, setEditedImage] = useState(null);
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
    setEditedImage(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image to edit.");
      return;
    }

    setLoading(true);
    setError(null);
    setEditedImage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('prompt', prompt);

    try {
      const response = await fetch('https://ai-creative-studio.onrender.com/edit-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to edit image.');
      }

      const data = await response.json();
      if (data.image) {
        setEditedImage(`data:image/png;base64,${data.image}`);
      } else {
        setError(data.text || 'No image data received, but request was successful.');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 p-4 shadow-lg rounded-3 glassmorphism-card">
      <h2 className="text-center mb-4 text-light fw-bold">Edit Existing Image</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label className="fw-bold text-light">Upload an image to edit:</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleFileChange} required className="shadow-sm" />
        </Form.Group>

        {previewImage && (
          <div className="mb-3 text-center p-3 border rounded-3 glassmorphism-card-inner shadow-sm">
            <h4 className="mb-3 text-light">Original Image Preview:</h4>
            <Image src={previewImage} alt="Original" fluid rounded style={{ maxWidth: '400px', maxHeight: '300px' }} />
          </div>
        )}

        {editedImage && (
          <div className="mt-4 text-center p-3 border rounded-3 glassmorphism-card-inner shadow-sm">
            <h3 className="mb-3 text-light">Edited Image:</h3>
            <div className="image-with-download-wrapper position-relative d-inline-block">
              <Image src={editedImage} alt="Edited by AI" fluid rounded style={{ maxHeight: '400px', width: 'auto', objectFit: 'contain' }} />
              <a href={editedImage} download="edited_image.png" className="download-icon-btn">
                <FaDownload size={24} />
              </a>
            </div>
          </div>
        )}

        <Form.Group className="mb-3" controlId="editPrompt">
          <Form.Label className="fw-bold text-light">Enter your editing prompt:</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Blur the background of the person in this image and give it a more professional look. (Be descriptive!)"
            required
            className="shadow-sm"
          />
        </Form.Group>
        <Button variant="warning" type="submit" disabled={loading || !selectedFile} className="w-100 py-2">
          {loading ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Editing...</> : 'Edit Image'}
        </Button>
      </Form>

      {error && <Alert variant="danger" className="mt-4 shadow-sm">{error}</Alert>}
    </Container>
  );
}

export default EditImage;