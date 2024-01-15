import sinon from "sinon"
import { expect } from "chai"
import mongoose from "mongoose"
import User from "../models/user.js"
import authController from "../controllers/auth.js"

it("should throw an error with code 500 if accessing the database fails", async () => {
  sinon.stub(User, "findOne")
  User.findOne.throws()

  const req = {
    body: {
      email: "test@gmail.com",
      password: "tester",
    },
  }
})
