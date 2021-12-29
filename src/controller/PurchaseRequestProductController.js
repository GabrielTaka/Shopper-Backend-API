const PurchaseRequestModel = require("../model/PurchaseRequestModel");
const PurchaseRequestProductModel = require("../model/PurchaseRequestProductModel");
const ProductModel = require("../model/ProductModel");

class PurchaseRequestProductController {

  async create(req, res) {
    const purchaseRequest = new PurchaseRequestModel(req.body.purchaseRequest);
    await purchaseRequest.save().then(async (result) => {

      req.body.products.forEach(async (product) => {
        const purchaseRequestProduct = new PurchaseRequestProductModel(
          {
            product: product.id,
            purchaseRequest: result._id,
            quantity: product.quantity,
            amount_of_product: product.quantity * product.price,
          })

        await purchaseRequestProduct.save().then(async (response) => {
          await PurchaseRequestModel.findByIdAndUpdate(result._id, { '$push': { 'purchaseRequestProducts': response._id.toString() } });

          await ProductModel.findById(product.id)
            .then(async (result) => {
              await ProductModel.findByIdAndUpdate({ '_id': product.id }, { qty_stock: result.qty_stock - product.quantity });
            }).catch((err) => {

            });

        }).catch((err) => {
          return res.status(500).json(err);
        });
      });

      return res.status(200).json(result);
    }).catch((err) => {
      return res.status(500).json(err);
    });
  }

  async update(req, res) {
    console.log("====================== ????")
    console.log(req.body)
    console.log(req.params.id)
    await PurchaseRequestModel.findByIdAndUpdate({ '_id': req.params.id }, req.body.purchaseRequest)
      .populate({ path: 'purchaseRequestProducts' })
      .then(async (result) => {


        req.body.products.forEach(async product => {
          let position = result.purchaseRequestProducts.map(function (e) { return e.product.toString(); }).indexOf(product.id);

          if (position != -1) {
            await PurchaseRequestProductModel.findByIdAndUpdate(
              result.purchaseRequestProducts[position]._id.toString(),
              { "quantity": product.quantity }

            ).then(async (resultPurchaseRequestProductModel) => {

              await ProductModel.findById(resultPurchaseRequestProductModel.product.toString())
                .then(async (productModel) => {


                  console.log(product.quantity)
                  console.log("===============")
                  if (resultPurchaseRequestProductModel.quantity < product.quantity) {
                    await ProductModel.findByIdAndUpdate(
                      { '_id': productModel._id },
                      { qty_stock: productModel.qty_stock - (product.quantity - resultPurchaseRequestProductModel.quantity) })

                  } else {
                    await ProductModel.findByIdAndUpdate(
                      { '_id': productModel._id },
                      { qty_stock: productModel.qty_stock + (resultPurchaseRequestProductModel.quantity - product.quantity) })
                      .then(async (resultProductModel) => {
                        if (product.quantity === 0) {
                          console.log("delete document?")
                          await PurchaseRequestProductModel.deleteOne({ '_id': result.purchaseRequestProducts[position]._id.toString() })
                        }
                      })
                  }
                })

            }).catch((err) => {
              console.log(err)
            });
          } else {
            const purchaseRequestProduct = new PurchaseRequestProductModel(
              {
                product: product.id,
                purchaseRequest: result._id,
                quantity: product.quantity,
                amount_of_product: product.quantity * product.price,
              })

            await purchaseRequestProduct.save().then(async (response) => {
              await PurchaseRequestModel.findByIdAndUpdate(result._id, { '$push': { 'purchaseRequestProducts': response._id.toString() } });

              await ProductModel.findById(product.id)
                .then(async (result) => {
                  await ProductModel.findByIdAndUpdate({ '_id': product.id }, { qty_stock: result.qty_stock - product.quantity });
              })
            })
          }
        });

        return res.status(200).json(result);
      }).catch((err) => {
        console.log(err)
        return res.status(500).json(err);
      });
  }


}


module.exports = new PurchaseRequestProductController();