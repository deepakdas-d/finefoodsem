"use client";
import { useState, useEffect } from "react";
import { FiSave, FiX, FiUser, FiMail, FiPhone, FiBriefcase, FiGrid } from "react-icons/fi";

const departments = [
    "Development",
    "Design",
    "Marketing",
    "Sales",
    "Human Resources",
    "Operations",
    "Finance",
];

export default function EmployeeForm({ initialData = null, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "Development",
        position: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="form-container glass animate-fade-in">
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
                        required
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
                        placeholder="e.g. Senior Frontend Developer"
                        required
                    />
                </div>
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="cancel-button">
                    <FiX /> Cancel
                </button>
                <button type="submit" className="save-button">
                    <FiSave /> {initialData ? "Update Employee" : "Save Employee"}
                </button>
            </div>

            <style jsx>{`
        .form-container {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
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
