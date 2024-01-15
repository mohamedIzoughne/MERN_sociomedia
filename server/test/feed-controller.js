// import sinon from "sinon"
// import { expect } from "chai"
// import mongoose from "mongoose"
// import User from "../models/user.js"
// import authController from "../controllers/auth.js"
// import { beforeEach } from "node:test"

// describe("Feed controller -- login", () => {
//   before((done) => {
//     mongoose
//       .connect(
//         "mongodb+srv://izourne003:test123@cluster0.0oxsnir.mongodb.net/test_database?retryWrites=true&w=majority"
//       )
//       .then(() => {
//         const user = new User({
//           _id: "5fa5bc7fe4b11f6d8c71e4d1",
//           fullName: "test",
//           email: "test@test.com",
//           password: "test123",
//           friends: [],
//         })
//         return user.save()
//       })
//       .then(() => {
//         done()
//       })
//   })

//   it("should throw an error with code 500 if accessing the database fails", async () => {
//     sinon.stub(User, "findOne")
//     User.findOne.throws()

//     const req = {
//       body: {
//         email: "test@gmail.com",
//         password: "tester",
//       },
//     }

//     await authController
//       .postLogin(req, {}, () => {})
//       .then((result) => {
//         expect(result).to.be.an("error")
//         expect(result).to.have.property("statusCode", 500)
//         // done()
//       })

//     User.findOne.restore()
//     // after(async () => {
//     //   await mongoose.connect(process.env.MONGO_URI)
//     // })
//   })

//   it("should send a response with valid user status for an existing user", (done) => {
//     const req = { userId: "5fa5bc7fe4b11f6d8c71e4d1" }
//     const res = {
//       statusCode: 500,
//       userStatus: null,
//       status: function (code) {
//         this.statusCode = code
//         return this
//       },
//       json: function (data) {
//         this.userStatus = data.status
//       },
//     }
//     authController
//       .getUserStatus(req, res, () => {})
//       .then(() => {
//         expect(res.statusCode).to.be.equal(200)
//         expect(res.userStatus).to.be.equal("I am new!")
//         done()
//       })
//   })

//   afterEach(function () {})
//   beforeEach(function () {})

//   after(function () {
//     User.deleteMany({})
//       .then(() => {
//         return mongoose.disconnect()
//       })
//       .then(() => {
//         done()
//       })
//   })
// })
