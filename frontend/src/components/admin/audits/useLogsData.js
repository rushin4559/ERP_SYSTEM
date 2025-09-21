import { useEffect, useState } from "react";
import { getLogs } from "../../../api/admin/logs";

/**
 * Custom hook to fetch logs with pagination, filters, and sorting.
 * @param {Object} params
 *   - page, limit, search, status, service, from, to, sort
 */
export default function useLogsData(params) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // avoid state update if unmounted
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getLogs(params);
        if (isMounted) {
          setData(res.data || []);
          setTotal(res.total || 0);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load logs");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLogs();

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(params)]); 
  // 👆 stringified params so hook refetches when filters/pagination change

  return { data, total, loading, error };
}
