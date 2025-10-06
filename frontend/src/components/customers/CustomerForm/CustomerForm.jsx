// src/components/customer/CustomerForm/CustomerForm.jsx
import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import { toast } from "react-toastify";

export default function CustomerForm({ isOpen, onClose, onSubmit, initialData }) {
  const defaultFormData = {
    customer_name: "",
    vendor_code: "",
    PAN_NO: "",
    GSTN: "",
    phone_no: "",
    email_id: "",
    state_code: "",
    state_name: "",
    address: "",
    contact_person: "",
  };

  const [formData, setFormData] = useState({ ...defaultFormData });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const cleaned = Object.keys(defaultFormData).reduce((acc, key) => {
          acc[key] = initialData[key] ?? "";
          return acc;
        }, {});
        setFormData(cleaned);
      } else {
        setFormData({ ...defaultFormData });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success(
        initialData?.id ? "Customer updated successfully!" : "Customer created successfully!"
      );
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isSubmitDisabled = !formData.customer_name.trim() || submitting;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-5 text-gray-800">
          {initialData?.id ? "Update Customer" : "Create Customer"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Customer Name *"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            placeholder="Customer Name *"
            required
          />

          <FormInput
            label="Vendor Code"
            name="vendor_code"
            value={formData.vendor_code}
            onChange={handleChange}
            placeholder="Vendor Code"
          />

          <FormInput
            label="PAN_NO"
            name="PAN_NO"
            value={formData.PAN_NO}
            onChange={handleChange}
            placeholder="PAN_NO"
            maxLength={10}
          />

          <FormInput
            label="GSTN"
            name="GSTN"
            value={formData.GSTN}
            onChange={handleChange}
            placeholder="GSTN"
            maxLength={15}
          />

          <FormInput
            label="Phone Number"
            name="phone_no"
            value={formData.phone_no}
            onChange={handleChange}
            placeholder="Phone Number"
          />

          <FormInput
            label="Email"
            name="email_id"
            type="email"
            value={formData.email_id}
            onChange={handleChange}
            placeholder="Email"
          />

          <FormInput
            label="State Code"
            name="state_code"
            value={formData.state_code}
            onChange={handleChange}
            placeholder="State Code"
            maxLength={2}
          />

          <FormInput
            label="State Name"
            name="state_name"
            value={formData.state_name}
            onChange={handleChange}
            placeholder="State Name"
          />

          <FormInput
            label="Contact Person"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleChange}
            placeholder="Contact Person"
          />

          <FormInput
            label="Address"
            name="address"
            type="textarea"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            rows={3}
          />

          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`px-4 py-2 rounded-md text-white transition ${
                isSubmitDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              }`}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
