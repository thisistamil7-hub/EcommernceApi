const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');

router.post('/',CategoryController.CreateCategory);
router.get('/',CategoryController.getAllCategory);



module.exports = router;
