"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { getEmployees } from "@/lib/employeeService";

const SearchContext = createContext();

const navigationItems = [
    { name: "Dashboard", path: "/dashboard", type: "nav" },
    { name: "Employees List", path: "/dashboard/employees", type: "nav" },
    { name: "Add New Employee", path: "/dashboard/employees/add", type: "nav" },
    { name: "Daily Attendance (Check-in/out)", path: "/dashboard/attendance/add", type: "nav" },
    { name: "Attendance History", path: "/dashboard/attendance", type: "nav" },
    { name: "Reports & Analytics", path: "/dashboard/reports", type: "nav" },
];

export function SearchProvider({ children }) {
    const { user, loading } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [employees, setEmployees] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchEmployees = async () => {
            if (!user) {
                setEmployees([]);
                return;
            }

            try {
                const data = await getEmployees();
                setEmployees(data);
            } catch (error) {
                console.error("Error fetching employees for search:", error);
            }
        };

        if (!loading) {
            fetchEmployees();
        }
    }, [user, loading]);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();

        // 1. Filter Navigation Items
        const navResults = navigationItems.filter(item =>
            item.name.toLowerCase().includes(query)
        );

        // 2. Filter Employee Data
        const employeeResults = employees
            .filter(emp =>
                emp.name?.toLowerCase().includes(query) ||
                emp.employeeId?.toLowerCase().includes(query) ||
                emp.department?.toLowerCase().includes(query)
            )
            .map(emp => ({
                name: emp.name,
                path: `/dashboard/employees/${emp.id}`,
                type: "employee",
                subtitle: `${emp.employeeId} - ${emp.department}`
            }));

        return [...navResults, ...employeeResults].slice(0, 10);
    }, [searchQuery, employees]);

    const value = {
        searchQuery,
        setSearchQuery,
        searchResults,
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
}
