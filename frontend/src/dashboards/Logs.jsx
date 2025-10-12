import React, { useState, useEffect } from "react";

import useLogs from "../hooks/useLogs";

import MetaHeader from "../shared-ui/MetaDataHeader";
import Pagination from "../shared-ui/Pagination";
import DataTable from "../shared-ui/DataTable";
import SharedFilter from "../shared-ui/SharedFilter";
import LogFilters from "../components/admin/audits/LogFilters";

export default function Logs() {
  const {
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
    handleApplyFilters,
    handleExport,
  } = useLogs();

  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Update local inputs but don't reload data yet
  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    console.log("Changing local filter:", name, value);
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  // When Apply clicked, apply localFilters to global filters, triggers fetch
  const handleApply = () => {
    console.log("Applying filters:", localFilters);
    handleApplyFilters(localFilters);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <header className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Logs
          </h1>
        </header>

        <section>
          <MetaHeader
            total={totalLogs}
            pages={totalPages}
            page={page}
            limit={limit}
            showingCount={logs.length}
          />
        </section>

        <section>
          <SharedFilter
            onApply={handleApply}
            onReset={() => {
              const cleared = { search: "", from: "", to: "",  status: "", service: "", action: "", sort: "date_desc" };
              setLocalFilters(cleared); // reset local inputs
              setFilters(cleared);      // reset global filters triggers reload once
            }}
            onExport={() => handleExport(localFilters)}
          >
            <LogFilters filters={localFilters} onChange={handleLocalChange} />
          </SharedFilter>


        </section>

        <section className="rounded-lg bg-white shadow-md p-4 overflow-x-auto">
          <DataTable
            data={logs}
            loading={loading}
            selectedIds={[]}         // no selection on logs
            setSelectedIds={() => { }}
            showActions={false}       // no edit/delete actions
            showCheckboxes={false}    // no checkboxes
            rowKey="id"               // use id as row key
            noDataMessage="No logs found."
            columns={[
              { header: "Date", key: "created_at", className: "whitespace-nowrap" },
              { header: "User", key: "username" },
              { header: "Action", key: "action" },
              { header: "Service", key: "service" },
              { header: "Status", key: "status" },
            ]}
            onSortChange={(key, order) => {
              setFilters((prev) => ({
                ...prev,
                sort_by: key,
                order: order,
              }));
              setPage(1); // Reset page on sort change
            }}
            initialSortBy={filters.sort_by}
            initialOrder={filters.order}
          />

        </section>

        <section>
          <Pagination
            page={page}
            totalPages={totalPages}
            limit={limit}
            setPage={setPage}
            setLimit={setLimit}
          />
        </section>
      </div>
    </div>
  );
}
