const express = require("express");
const router = express.Router();

const ProductController = require("../controller/ProductController");
router.post('/', ProductController.generateDataBase);
router.get('/', ProductController.all);

module.exports = router;