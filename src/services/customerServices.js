const Customer = require("../models/Customer.js");

const CustomerServices = {

  async createCustomer(data) {
    const customer = new Customer(data);
    return await customer.save();
  },

  // ✅ Get all customers
  async getAllCustomers() {
    return await Customer.find().sort({ createdAt: -1 });
  },

  // ✅ Get single customer by ID
  async getCustomerById(id) {
    return await Customer.findById(id);
  },

  // ✅ Update customer
  async updateCustomer(id, data) {
    return await Customer.findByIdAndUpdate(id, data, { new: true });
  },

  // ✅ Delete customer
  async deleteCustomer(id) {
    return await Customer.findByIdAndDelete(id);
  },
};

module.exports = CustomerServices;
