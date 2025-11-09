const CustomerServices = require('../services/customerServices');

const CustomerController = {

  // ✅ Create Customer
  CreateCustomer: async (req, res) => {
    try {
      const customer = await CustomerServices.createCustomer(req.body);
      res.status(201).json({
        message: "Customer created successfully",
        data: customer,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ✅ Get All Customers
  GetAllCustomers: async (req, res) => {
    try {
      const customers = await CustomerServices.getAllCustomers();
      res.status(200).json({
        message: "All customers fetched successfully",
        data: customers,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ✅ Get Customer by ID
  GetCustomerById: async (req, res) => {
    try {
      const customer = await CustomerServices.getCustomerById(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.status(200).json({
        message: "Customer fetched successfully",
        data: customer,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ✅ Update Customer
  UpdateCustomer: async (req, res) => {
    try {
      const updated = await CustomerServices.updateCustomer(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.status(200).json({
        message: "Customer updated successfully",
        data: updated,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ✅ Delete Customer
  DeleteCustomer: async (req, res) => {
    try {
      const deleted = await CustomerServices.deleteCustomer(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.status(200).json({
        message: "Customer deleted successfully",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = CustomerController;
