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
    action: "",
    from: "",
    to: "",
    sort_by: "created_at", // default column
    order: "desc",         // default order
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
        action: filters.action,
        from: filters.from,
        to: filters.to,
        sort: `${filters.sort_by}:${filters.order}`,
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

  const filtersToShortString = (filters) => {
    const parts = [];

    if (filters.search) {
      parts.push(`s-${filters.search.substring(0, 5)}`);  // search, short
    }
    if (filters.status) {
      parts.push(`st-${filters.status.substring(0, 3)}`); // status short
    }
    if (filters.service) {
      parts.push(`svc-${filters.service.substring(0, 3)}`); // service short
    }
    if (filters.action) {
      parts.push(`a-${filters.action.substring(0, 5)}`);
    }
    if (filters.from) {
      parts.push(`f-${filters.from.replace(/-/g, '')}`); // from date no dash
    }
    if (filters.to) {
      parts.push(`t-${filters.to.replace(/-/g, '')}`);  // to date no dash
    }

    return parts.join('_');
  }


  const handleExport = async (exportParams) => {
    try {
      // Get total count to show in confirm dialog
      const data = await getLogs({ ...exportParams, page: 1, limit: 1 });
      const total = data.total || (data.data ? data.data.length : 0);

      if (total === 0) {
        alert("No logs found with the selected filters.");
        return;
      }

      const confirmed = window.confirm(`Export ${total} logs matching the selected filters to CSV?`);

      if (confirmed) {
        const blob = await exportLogs(exportParams);

        // Create short filter summary string
        const shortFilters = filtersToShortString(exportParams);
        const filename = `logs_${shortFilters || 'all'}_${Date.now()}.csv`;

        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Logs exported successfully.");
      }
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
