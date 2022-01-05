const express = require("express");
const router = express.Router();
const PurchaseRequestProductController = require("../controller/PurchaseRequestProductController");

router.post('/', PurchaseRequestProductController.create);
router.put('/:id', PurchaseRequestProductController.update);
router.delete('/:id/:id_purchase_request',  PurchaseRequestProductController.delete);

module.exports = router;