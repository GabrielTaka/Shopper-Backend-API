const PurchaseRequestModel = require("../model/PurchaseRequestModel");
const PurchaseRequestProductModel = require("../model/PurchaseRequestProductModel");
const ProductModel = require("../model/ProductModel");
class PurchaseRequestProductController {

  async create(req, res) {
    const purchaseRequest = new PurchaseRequestModel(req.body.purchaseRequest);
    await purchaseRequest.save().then(async (purchaseRequestResult) => {

      //Add products in purchase request product model
      req.body.products.forEach(async (product) => {
        const purchaseRequestProduct = new PurchaseRequestProductModel(
          {
            product: product.id,
            purchaseRequest: purchaseRequestResult._id,
            quantity: product.quantity,
            amount_of_product: product.quantity * product.price,
          })

        await purchaseRequestProduct.save().then(async (purchaseRequestProductResponse) => {

          //Add id of purchase request products into array of purchase request model
          await PurchaseRequestModel.findByIdAndUpdate(purchaseRequestResult._id, { '$push': { 'purchaseRequestProducts': purchaseRequestProductResponse._id.toString() } });

          //Decrement qty_stock of product
          await ProductModel.findById(product.id)
            .then(async (resultProductResponse) => {
              await ProductModel.findByIdAndUpdate({ '_id': product.id }, { qty_stock: resultProductResponse.qty_stock - product.quantity });
            })
        })
      });

      return res.status(200).json(purchaseRequestResult);
    }).catch((err) => {
      return res.status(500).json(err);
    });
  }

  async update(req, res) {

    //Find purchase request by id
    await PurchaseRequestModel.findByIdAndUpdate({ '_id': req.params.id }, req.body.purchaseRequest)
      .populate({ path: 'purchaseRequestProducts' })
      .then(async (result) => {

        req.body.products.forEach(async product => {

          //Checking whether the product in the array is an already added or new product
          let position = result.purchaseRequestProducts.map(function (e) { return e.product.toString(); }).indexOf(product.id);

          if (position != -1) {

            //Updating product quantity
            await PurchaseRequestProductModel.findByIdAndUpdate(result.purchaseRequestProducts[position]._id.toString(), { "quantity": product.quantity })
              .then(async (resultPurchaseRequestProductModel) => {

                await ProductModel.findById(resultPurchaseRequestProductModel.product.toString())
                  .then(async (productModel) => {

                    //Reducing quantity in stock 
                    if (resultPurchaseRequestProductModel.quantity < product.quantity) {
                      await ProductModel.findByIdAndUpdate(
                        { '_id': productModel._id },
                        { qty_stock: productModel.qty_stock - (product.quantity - resultPurchaseRequestProductModel.quantity) })

                    } else {

                      //Adding quantity in stock
                      await ProductModel.findByIdAndUpdate(
                        { '_id': productModel._id },
                        { qty_stock: productModel.qty_stock + (resultPurchaseRequestProductModel.quantity - product.quantity) })
                        .then(async () => {
                          if (product.quantity === 0) {
                            //If quantity is 0, delete base record
                            await PurchaseRequestProductModel.deleteOne({ '_id': result.purchaseRequestProducts[position]._id.toString() })
                          }
                        })
                    }
                  })
              })
          } else {
            //New product to be added
            const purchaseRequestProduct = new PurchaseRequestProductModel(
              {
                product: product.id,
                purchaseRequest: result._id,
                quantity: product.quantity,
                amount_of_product: product.quantity * product.price,
              })

            await purchaseRequestProduct.save().then(async (response) => {

              //Add id of purchase request products into array of purchase request model
              await PurchaseRequestModel.findByIdAndUpdate(result._id, { '$push': { 'purchaseRequestProducts': response._id.toString() } });

              //Decrement quantity in stock
              await ProductModel.findById(product.id)
                .then(async (result) => {
                  await ProductModel.findByIdAndUpdate({ '_id': product.id }, { qty_stock: result.qty_stock - product.quantity });
                })
            })
          }
        });

        return res.status(200).json(result);
      })
  }

  async delete(req, res) {
    if (req.params.id === undefined) return res.status(200).json("No registered products.")
    let purchaseRequestObject = {};
    
    await PurchaseRequestProductModel.findById(req.params.id)
      .then(async (result) => {
        purchaseRequestObject = result
        await PurchaseRequestProductModel.deleteOne({ '_id': req.params.id })
          .then(async (resultPurchaseRequestProductModel) => {

            await PurchaseRequestModel.findById(req.params.id_purchase_request)
              .then(async (resultPurchaseRequestModel) => {

                await PurchaseRequestModel.findByIdAndUpdate(
                  { '_id': resultPurchaseRequestModel._id },
                  { 'total_amount': parseFloat(resultPurchaseRequestModel.total_amount) - parseFloat(purchaseRequestObject.amount_of_product) },

                ).then(async () => {

                  await ProductModel.findById(purchaseRequestObject.product.toString())
                    .then(async (resultProduct) => {

                      await ProductModel.findByIdAndUpdate(
                        { '_id': resultProduct._id.toString() },
                        { 'qty_stock': resultProduct.qty_stock + purchaseRequestObject.quantity },
                      )
                    })  
                })
              })
          })

          return res.status(200).json(result);
      })
  }
}

module.exports = new PurchaseRequestProductController();