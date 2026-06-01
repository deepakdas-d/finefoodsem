"use client";
import { useState, useEffect, useCallback } from "react";
import { getAttendanceRecords } from "@/lib/attendanceService";

export function useAttendance(filters = {}) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAttendance = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAttendanceRecords(filters);
            setRecords(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [filters.employeeId]);

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    return { records, loading, error, refetch: fetchAttendance };
}
