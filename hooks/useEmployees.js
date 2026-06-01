"use client";
import { useState, useEffect, useCallback } from "react";
import { getEmployees } from "@/lib/employeeService";

export function useEmployees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEmployees = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getEmployees();
            setEmployees(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    return { employees, loading, error, refetch: fetchEmployees };
}
