"use client";
import { FiFilter, FiUser, FiCalendar } from "react-icons/fi";

export default function ReportFilters({
    employees,
    filters,
    setFilters,
    onApply
}) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="filters-container glass animate-fade-in">
            <div className="filter-item">
                <label><FiUser /> Employee</label>
                <select name="employeeId" value={filters.employeeId} onChange={handleChange}>
                    <option value="">All Employees</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                </select>
            </div>

            <div className="filter-item">
                <label><FiCalendar /> Start Date</label>
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleChange}
                />
            </div>

            <div className="filter-item">
                <label><FiCalendar /> End Date</label>
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleChange}
                />
            </div>

            <button onClick={onApply} className="apply-btn">
                <FiFilter /> Apply Filters
            </button>

            <style jsx>{`
        .filters-container {
          padding: 1.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          align-items: flex-end;
          margin-bottom: 1.5rem;
        }

        .filter-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 200px;
        }

        .filter-item label {
          font-size: 0.85rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-item select, .filter-item input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--card-border);
          padding: 0.6rem 0.75rem;
          border-radius: 8px;
          color: var(--foreground);
        }

        .filter-item select option {
          background: var(--secondary);
        }

        .apply-btn {
          background: var(--primary);
          color: white;
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .apply-btn:hover {
          filter: brightness(1.2);
        }

        @media (max-width: 640px) {
          .filter-item { min-width: 100%; }
        }
      `}</style>
        </div>
    );
}
