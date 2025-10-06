// src/components/customer/CustomerCardList.jsx
import React from "react";
import CustomerCard from "./CustomerCard";

export default function CustomerCardList({ customers = [], loading, selectedIds, setSelectedIds, onEdit, onDelete }) {
  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  if (loading) {
    return <p className="p-4 text-center text-gray-500">Loading customers...</p>;
  }

  if (customers.length === 0) {
    return <p className="p-4 text-center text-gray-500">No customers found.</p>;
  }

  return (
    <div className="space-y-4">
      {customers.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          isSelected={selectedIds.includes(customer.id)}
          onSelect={handleSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
