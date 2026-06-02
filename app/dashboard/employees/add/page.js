"use client";
import EmployeeForm from "@/components/employees/EmployeeForm";
import { addEmployee } from "@/lib/employeeService";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiUserPlus } from "react-icons/fi";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

export default function AddEmployeePage() {
  const router = useRouter();
  const { addToast } = useToast();

  const handleSubmit = async (data) => {
    try {
      await addEmployee(data);
      router.push("/dashboard/employees");
    } catch (err) {
      addToast(err.message || "Failed to add employee", "error");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <Link href="/dashboard/employees" className="back-link">
          <FiArrowLeft /> Back to Directory
        </Link>
        <div className="header-title">
          <div className="icon-badge">
            <FiUserPlus />
          </div>
          <div>
            <h1>Add New Employee</h1>
            <p className="subtitle">Fill in the details to create a new profile</p>
          </div>
        </div>
      </div>

      <EmployeeForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/employees")}
      />

      <style jsx>{`
        .page-header {
          margin-bottom: 2.5rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .back-link:hover {
          color: var(--primary);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .icon-badge {
          width: 50px;
          height: 50px;
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        h1 {
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
