import { useState, useEffect } from "react";
import { getLogs, exportLogs } from "./../api/authadmin/logs";
import { toast } from "react-toastify";

export default function useLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    service: "",
    from: "",
    to: "",
    sort: "date_desc",
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        username: filters.search,
        status: filters.status,
        service: filters.service,
        from: filters.from,
        to: filters.to,
        sort: filters.sort,
      };
      console.log("Fetching logs with params:", params);
      const data = await getLogs(params);
      setLogs(data.data);
      setTotalPages(data.totalPages || 1);
      setTotalLogs(data.total || data.data.length);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      toast.error("Failed to fetch logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    console.log("Fetching logs with params:", { page, limit, ...filters });
    // eslint-disable-next-line
  }, [page, limit, filters]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleExport = async (exportParams) => {
    try {
      const blob = await exportLogs(exportParams);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "logs_export.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Logs exported successfully.");
    } catch (err) {
      console.error("Error exporting logs:", err);
      toast.error("Failed to export logs.");
    }
  };

  return {
    logs,
    loading,
    page,
    limit,
    totalPages,
    totalLogs,
    filters,
    setPage,
    setLimit,
    setFilters,
    fetchLogs,
    handleApplyFilters,
    handleExport,
  };
}
