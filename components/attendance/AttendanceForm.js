"use client";
import { useState, useEffect } from "react";
import { FiSave, FiX, FiUser, FiCalendar, FiClock, FiActivity } from "react-icons/fi";
import { calculateHours } from "@/lib/calculateHours";
import { getTodayStr } from "@/utils/formatDate";

export default function AttendanceForm({ employees, initialData = null, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        employeeId: "",
        date: getTodayStr(),
        checkIn: "09:00",
        checkOut: "18:00",
        totalHours: 9,
        status: "Present",
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else if (employees.length > 0 && !formData.employeeId) {
            setFormData(prev => ({ ...prev, employeeId: employees[0].id }));
        }
    }, [initialData, employees]);

    // Recalculate hours when times change
    useEffect(() => {
        if (formData.checkIn && formData.checkOut) {
            const hours = calculateHours(formData.checkIn, formData.checkOut);
            setFormData(prev => ({ ...prev, totalHours: hours }));
        }
    }, [formData.checkIn, formData.checkOut]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const employee = employees.find(emp => emp.id === formData.employeeId);
        onSubmit({
            ...formData,
            employeeName: employee?.name || "Unknown",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="form-container glass animate-fade-in">
            <div className="form-grid">
                <div className="input-group full-width">
                    <label><FiUser /> Select Employee</label>
                    <select
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Choose an employee...</option>
                        {employees.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                                {emp.name} ({emp.department})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label><FiCalendar /> Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label><FiActivity /> Status</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="Present">Present</option>
                        <option value="Late">Late</option>
                        <option value="Half Day">Half Day</option>
                        <option value="Overtime">Overtime</option>
                    </select>
                </div>

                <div className="input-group">
                    <label><FiClock /> Check-In Time</label>
                    <input
                        type="time"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label><FiClock /> Check-Out Time</label>
                    <input
                        type="time"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="hours-display full-width">
                    <span className="label">Total Calculated Hours:</span>
                    <span className="value">{formData.totalHours} hrs</span>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="cancel-button">
                    <FiX /> Cancel
                </button>
                <button type="submit" className="save-button">
                    <FiSave /> {initialData ? "Update Attendance" : "Save Attendance"}
                </button>
            </div>

            <style jsx>{`
        .form-container {
          padding: 2rem;
          max-width: 700px;
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
        }

        .input-group select option {
          background: var(--secondary);
        }

        .hours-display {
          background: rgba(99, 102, 241, 0.05);
          padding: 1rem;
          border-radius: 10px;
          border: 1px dashed var(--primary);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
        }

        .hours-display .label {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .hours-display .value {
          color: var(--primary);
          font-weight: 700;
          font-size: 1.2rem;
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

        .save-button {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
      `}</style>
        </form>
    );
}
