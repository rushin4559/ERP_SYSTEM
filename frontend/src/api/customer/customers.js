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
    responseType: 'blob', // Important: treat response as blob for file download
  });

  // Create a blob URL
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
  // Create a link element to trigger download
  const link = document.createElement('a');
  link.href = url;
  // Set file name with current timestamp
  link.setAttribute('download', `customers_export_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  // Cleanup
  link.remove();
  window.URL.revokeObjectURL(url);

  // Optionally return true on success
  return true;
};
