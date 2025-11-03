const express = require('express');
const router =express.Router();
const CategoryController= require('../controllers/categoryController');

router.post('/', CategoryController.CreateCategory);

module.exports = router;


