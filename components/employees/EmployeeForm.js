"use client";
import { useState, useEffect } from "react";
import { FiSave, FiX, FiUser, FiMail, FiPhone, FiBriefcase, FiGrid, FiCamera, FiUploadCloud } from "react-icons/fi";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";

const departments = [
  // "Development",
  // "Design",
  "Marketing",
  "Sales",
  // "Human Resources",
  // "Operations",
  "Finance",
];

export default function EmployeeForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Sales",
    position: "",
    imageUrl: "",
    publicId: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Only images are allowed (JPG, PNG, WEBP)");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    try {
      let finalData = { ...formData };

      // Upload image if a new one is selected
      if (imageFile) {
        const uploadResult = await uploadToCloudinary(imageFile);
        finalData.imageUrl = uploadResult.imageUrl;
        finalData.publicId = uploadResult.publicId;
      }

      await onSubmit(finalData);
      addToast(initialData ? "Employee updated successfully!" : "Employee added successfully!", "success");
    } catch (err) {
      console.error("Submission Error:", err);
      addToast(err.message || "Failed to save employee", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelClick = () => {
    // Only show modal if form has data
    if (formData.name || formData.email || imageFile) {
      setShowCancelModal(true);
    } else {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container glass animate-fade-in">
      {error && <div className="error-banner">{error}</div>}

      <div className="image-upload-section">
        <div className="image-preview-container">
          {imagePreview ? (
            <img src={imagePreview} alt="Employee Preview" className="preview-img" />
          ) : (
            <div className="preview-placeholder">
              <FiUser />
            </div>
          )}
          <label htmlFor="image-input" className="upload-badge" title="Upload Photo">
            <FiCamera />
          </label>
        </div>
        <input
          id="image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />
        <div className="upload-info">
          <h3>Profile Picture</h3>
          <p>JPG, PNG or WEBP. Max 5MB.</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="input-group">
          <label><FiUser /> Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Kumar"
            required
          />
        </div>

        <div className="input-group">
          <label><FiMail /> Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. rahul@test.com"
          />
        </div>

        <div className="input-group">
          <label><FiPhone /> Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +91 9876543210"
          />
        </div>

        <div className="input-group">
          <label><FiGrid /> Department</label>
          <select name="department" value={formData.department} onChange={handleChange}>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group full-width">
          <label><FiBriefcase /> Position / Job Title</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="e.g. Sales Executive"
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={handleCancelClick} className="cancel-button">
          <FiX /> Cancel
        </button>
        <button type="submit" className="save-button" disabled={uploading}>
          {uploading ? (
            <><FiUploadCloud className="spin" /> Uploading...</>
          ) : (
            <><FiSave /> {initialData ? "Update Employee" : "Save Employee"}</>
          )}
        </button>
      </div>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Discard Changes?"
        footer={
          <>
            <button className="cancel-button" onClick={() => setShowCancelModal(false)}>Keep Editing</button>
            <button className="save-button" style={{ background: 'var(--error)' }} onClick={onCancel}>Discard</button>
          </>
        }
      >
        <p>Are you sure you want to discard your changes? This action cannot be undone.</p>
      </Modal>

      <style jsx>{`
        .form-container {
          padding: 2.5rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .error-banner {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          text-align: center;
          font-weight: 500;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .image-upload-section {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--card-border);
        }

        .image-preview-container {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .preview-img, .preview-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 24px;
          object-fit: cover;
          border: 3px solid var(--card-border);
        }

        .preview-placeholder {
          background: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: var(--text-muted);
        }

        .upload-badge {
          position: absolute;
          bottom: -5px;
          right: -5px;
          width: 40px;
          height: 40px;
          background: var(--primary);
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          transition: transform 0.2s ease;
        }

        .upload-badge:hover {
          transform: scale(1.1);
        }

        .upload-info h3 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          font-weight: 700;
        }

        .upload-info p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .full-width {
          grid-column: span 2;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .input-group input, 
        .input-group select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--card-border);
          padding: 0.75rem 1rem;
          border-radius: 10px;
          color: var(--foreground);
          transition: border-color 0.3s ease;
        }

        .input-group input:focus, 
        .input-group select:focus {
          border-color: var(--primary);
        }

        .input-group select option {
          background: var(--secondary);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--card-border);
        }

        .cancel-button, .save-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .cancel-button {
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
        }

        .cancel-button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--foreground);
        }

        .save-button {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .save-button:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: span 1;
          }
        }
      `}</style>
    </form>
  );
}
