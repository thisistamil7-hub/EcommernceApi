const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customerController');

router.post('/', CustomerController.CreateCustomer);
router.get('/', CustomerController.GetAllCustomers);
router.get('/:id', CustomerController.GetCustomerById);
router.put('/:id', CustomerController.UpdateCustomer);
router.delete('/:id', CustomerController.DeleteCustomer);

module.exports = router;
