const express = require("express");
const router = express.Router();

const PurchaseRequestController = require("../controller/PurchaseRequestController");
const PurchaseRequestValidation = require("../middlewares/PurchaseRequestValidation");

router.post('/', PurchaseRequestValidation, PurchaseRequestController.create);
router.get('/:id',  PurchaseRequestController.show);
router.get('/',  PurchaseRequestController.all);

module.exports = router;