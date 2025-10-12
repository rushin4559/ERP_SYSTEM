import customerApi from "./customerApi";

// Existing APIs
export const getCustomers = async (params = {}) => {
  // params = { page, limit, customer_name, state_name, ... }
  const res = await customerApi.get('/customers', { params });
  return {
    rows: res.data.data,
    meta: res.data.meta,
  };
};

export const createCustomer = async (data) => {
  const res = await customerApi.post('/customers', data);
  return res.data.data;
};

export const updateCustomer = async (id, data) => {
  console.log("Updating customer in customers api:", { id, data });
  const res = await customerApi.put(`/customers/${id}`, data);
  console.log("Updated customer in customers api:", res.data);
  return res.data.data;
};

export const deleteCustomer = async (id) => {
  const res = await customerApi.delete(`/customers/${id}`);
  return res.data;
};

export const deleteMultipleCustomers = async (ids) => {
  const res = await customerApi.delete(`/customers`, {
    data: { ids },  // 👈 DELETE with body
  });
  return res.data;
};

// New API to export customers CSV
export const exportCustomersToCsv = async (filters = {}) => {
  const res = await customerApi.get('/customers/export', {
    params: filters,
    responseType: 'blob',
  });

  const shortFilters = filtersToShortString(filters);
  const filename = `customers_${shortFilters || 'all'}_${Date.now()}.csv`;

  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return true;
};


function filtersToShortString(filters) {
  // You can customize keys and shorten values as needed
  // Example: Take some keys and show first letter + value or abbreviation
  const parts = [];

  if (filters.customer_name) {
    parts.push(`cn-${filters.customer_name.substring(0, 5)}`); // customer_name first 5 chars
  }
  if (filters.state_name) {
    parts.push(`st-${filters.state_name.substring(0, 3)}`); // state_name first 3 chars
  }
  // Add other filters similarly: date ranges, etc.
  if (filters.created_at_min) {
    parts.push(`cmin-${filters.created_at_min.replace(/-/g, '')}`); // remove dashes from date
  }
  if (filters.created_at_max) {
    parts.push(`cmax-${filters.created_at_max.replace(/-/g, '')}`);
  }
  // Add more keys if relevant...

  return parts.join('_');
}
