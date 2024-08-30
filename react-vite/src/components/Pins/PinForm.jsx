import { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createPin } from "../../router/pin";
import TagSelector from "./TagSelector";
import "./PinForm.css";

const PinForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFormDisabled, setFormDisabled] = useState(true);
  const navigate = useNavigate();

  const tagOptions = useLoaderData();

  useEffect(() => {
    setFormDisabled(!file);
  }, [file]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (title.length < 2 || title.length > 100) {
      newErrors.title = "Title must be between 2 and 100 characters.";
    }
    if (description && description.length > 255) {
      newErrors.description = "Description cannot exceed 255 characters.";
    }
    return newErrors;
  };

  const handleRemoveImage = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) {
      formData.append("image_url", file);
    }

    tags.forEach((tag) => {
      formData.append("tags", tag);
    });

    try {
      const newPin = await createPin(formData);
      if (newPin && newPin.id) {
        navigate(`/pins/${newPin.id}`);
      } else {
        throw new Error("Failed to create pin");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Failed to create pin:", error);
      }
    }
  };

  return (
    <div>
      <h1>Create a New Pin</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div id="image-url-container">
          <label htmlFor="image_url" className="upload-label">
            {file ? (
              <div style={{ position: "relative" }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt="Image Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    marginTop: "10px",
                    borderRadius: "8px",
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="remove-image-btn"
                >
                  X
                </button>
              </div>
            ) : (
              <div>
                <p>Click To Upload Image</p>
              </div>
            )}
            <input
              type="file"
              id="image_url"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </label>
          <div className="error-container-pinform">
            {errors.image_url && <p>{errors.image_url}</p>}
          </div>
        </div>
        <div id="creating-pin-title">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isFormDisabled}
            required
          />
          <div className="error-container-pinform">
            {errors.title && <p>{errors.title}</p>}
          </div>
        </div>
        <div id="creating-pin-description">
          <label htmlFor="description">Description (optional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isFormDisabled}
          />
          <div className="error-container-pinform">
            {errors.description && <p>{errors.description}</p>}
          </div>
        </div>
        {/* Tags */}
        <TagSelector
          selectedTags={tags}
          setSelectedTags={setTags}
          tagOptions={tagOptions}
          isFormDisabled={isFormDisabled}
        />
        <button type="submit" disabled={isFormDisabled}>
          Create Pin
        </button>
      </form>
    </div>
  );
};

export default PinForm;
