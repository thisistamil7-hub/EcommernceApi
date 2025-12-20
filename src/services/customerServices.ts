// services/customerServices.ts
import { Model } from "mongoose";
import Customer, { ICustomer } from "../models/Customer";

interface CustomerData {
  username?: string;
  email?: string;
  phone?: string;
  address?: string;
  // Add other fields as needed
}

const CustomerServices = {
  // ✅ Create Customer
  createCustomer: async (data: CustomerData): Promise<ICustomer> => {
    const customer = new Customer(data);
    return await customer.save();
  },

  // ✅ Get all customers
  getAllCustomers: async (): Promise<ICustomer[]> => {
    return await Customer.find().sort({ createdAt: -1 });
  },

  // ✅ Get single customer by ID
  getCustomerById: async (id: string): Promise<ICustomer | null> => {
    return await Customer.findById(id);
  },

  // ✅ Update customer
  updateCustomer: async (id: string, data: CustomerData): Promise<ICustomer | null> => {
    return await Customer.findByIdAndUpdate(id, data, { new: true });
  },

  // ✅ Delete customer
  deleteCustomer: async (id: string): Promise<ICustomer | null> => {
    return await Customer.findByIdAndDelete(id);
  },
};

export default CustomerServices;
