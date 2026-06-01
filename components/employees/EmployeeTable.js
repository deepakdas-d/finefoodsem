"use client";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";

export default function EmployeeTable({ employees, onDelete }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredEmployees = employees.filter((emp) =>
        Object.values(emp).some((val) =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="table-container glass animate-fade-in">
            <div className="table-header">
                <h3>Employee Directory</h3>
                <div className="search-box">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Position</th>
                            <th>Phone</th>
                            <th className="actions-cell">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="table-row">
                                    <td>
                                        <div className="employee-info">
                                            <div className="employee-avatar">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <span className="name-bold">{emp.name}</span>
                                        </div>
                                    </td>
                                    <td>{emp.email}</td>
                                    <td>
                                        <span className="badge-dept">{emp.department}</span>
                                    </td>
                                    <td>{emp.position}</td>
                                    <td>{emp.phone || "N/A"}</td>
                                    <td className="actions-cell">
                                        <div className="action-btns">
                                            <Link href={`/dashboard/employees/${emp.id}`} className="edit-btn">
                                                <FiEdit2 />
                                            </Link>
                                            <button
                                                onClick={() => onDelete(emp.id)}
                                                className="delete-btn"
                                                title="Delete Employee"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="empty-state">No employees found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
        .table-container {
          padding: 1.5rem;
          margin-top: 1.5rem;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.5rem 1rem;
          border-radius: 10px;
          border: 1px solid var(--card-border);
          width: 300px;
        }

        .search-box input {
          background: none;
          border: none;
          color: var(--foreground);
          margin-left: 0.5rem;
          width: 100%;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        th {
          padding: 1rem;
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.85rem;
          text-transform: uppercase;
          border-bottom: 1px solid var(--card-border);
        }

        td {
          padding: 1rem;
          border-bottom: 1px solid var(--card-border);
          font-size: 0.95rem;
        }

        .table-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .employee-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .employee-avatar {
          width: 32px;
          height: 32px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.8rem;
        }

        .name-bold {
          font-weight: 600;
        }

        .badge-dept {
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .actions-cell {
          text-align: right;
        }

        .action-btns {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }

        .edit-btn, .delete-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .edit-btn {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
        }

        .edit-btn:hover {
          color: var(--primary);
          background: rgba(99, 102, 241, 0.1);
        }

        .delete-btn {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
        }

        .delete-btn:hover {
          color: var(--error);
          background: rgba(239, 68, 68, 0.1);
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
}
