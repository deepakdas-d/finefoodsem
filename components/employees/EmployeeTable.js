"use client";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearch } from "@/components/SearchContext";

export default function EmployeeTable({ employees, onDelete }) {
  const { searchQuery, setSearchQuery } = useSearch();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync local search with global search
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const filteredEmployees = employees.filter((emp) => {
    const query = (localSearch || "").toLowerCase().trim();
    if (!query) return true;

    return (
      (emp.name?.toLowerCase() || "").includes(query) ||
      (emp.email?.toLowerCase() || "").includes(query) ||
      (emp.department?.toLowerCase() || "").includes(query) ||
      (emp.position?.toLowerCase() || "").includes(query) ||
      (emp.employeeId?.toLowerCase() || "").includes(query)
    );
  });

  return (
    <div className="table-container glass animate-fade-in">
      <div className="table-header">
        <div>
          <h3>Employee Directory</h3>
          <p className="subtitle">Total: {filteredEmployees.length} employees</p>
        </div>
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name, email, department..."
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setSearchQuery(e.target.value);
            }}
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
                      {emp.imageUrl ? (
                        <img src={emp.imageUrl} alt={emp.name} className="table-avatar" />
                      ) : (
                        <div className="table-avatar-placeholder">
                          {emp.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="emp-name">{emp.name}</div>
                        <div className="emp-id">{emp.employeeId}</div>
                      </div>
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
                <td colSpan="6" className="empty-state">No matching employees found.</td>
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
          margin-bottom: 2rem;
        }

        .subtitle { color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem; }

        .search-box {
          display: flex;
          align-items: center;
          background: var(--secondary);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid var(--card-border);
          width: 350px;
          transition: all 0.3s ease;
        }

        .search-box:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
        }

        .search-box input {
          background: none;
          border: none;
          color: var(--foreground);
          margin-left: 0.75rem;
          width: 100%;
          font-size: 0.9rem;
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
          padding: 1.25rem 1rem;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid var(--card-border);
        }

        td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--card-border);
          font-size: 0.95rem;
        }

        .table-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .employee-info { display: flex; align-items: center; gap: 1rem; }
        .table-avatar, .table-avatar-placeholder {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 1rem; object-fit: cover;
        }
        .table-avatar-placeholder { background: var(--secondary); color: var(--primary); }
        .emp-name { font-weight: 600; color: var(--foreground); }

        .name-bold {
          font-weight: 700;
          color: var(--foreground);
        }

        .badge-dept {
          background: var(--secondary);
          color: var(--primary);
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          border: 1px solid rgba(251, 191, 36, 0.1);
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
