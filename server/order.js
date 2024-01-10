const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: {
    type: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order
