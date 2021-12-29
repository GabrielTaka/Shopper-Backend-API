const PurchaseRequestModel = require("../model/PurchaseRequestModel");


class PurchaseRequestController {

  async create(req, res) {
    const purchaseRequest = new PurchaseRequestModel(req.body);
    await purchaseRequest
      .save()
      .then((result) => {
        return res.status(200).json(result);
      }).catch((err) => {
        return res.status(500).json(err);
      });
  }

  async show(req, res) {
    const teste = await PurchaseRequestModel.findOne({_id: req.params.id})
    .populate({path: 'purchaseRequestProducts', populate: {path: 'product'}}  )
    return res.status(200).json(teste);
  }

  async all(req, res) {
    await PurchaseRequestModel.find({})
    .then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        return res.status(500).json(err);           
    });
  }
}

module.exports = new PurchaseRequestController();