const express = require("express");
const router = express.Router();

const PurchaseRequestProductController = require("../controller/PurchaseRequestProductController");

router.post('/', PurchaseRequestProductController.create);
router.put('/:id', PurchaseRequestProductController.update);


module.exports = router;