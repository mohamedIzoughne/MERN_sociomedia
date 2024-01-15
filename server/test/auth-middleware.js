import authMiddleware from "../middleware/is-auth.js"
import { expect } from "chai"
import jwt from "jsonwebtoken"
import sinon from "sinon"

describe("Auth middleware", () => {
  it("should throw an error if no authorization header is present", () => {
    const req = {
      get: function (headerName) {
        return null
      },
    }

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "not authenticated"
    )
  })

  it("should throw an error if the authorization is ony one string", () => {
    const req = {
      get: function (headerName) {
        return "xyz"
      },
    }

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw()
  })

  it("should throw an error if token is not verified", () => {
    const req = {
      get: function () {
        return "Bearer xyz"
      },
    }

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw()
  })

  it("should yield a userid after decoding the token", () => {
    const req = {
      get: function (headerName) {
        return "Bearer xkslkfjksjslifskjldsld"
      },
    }

    sinon.stub(jwt, "verify")
    jwt.verify.returns({ userId: "abc" })
    authMiddleware(req, {}, () => {})
    expect(req).to.have.property("userId")
    expect(jwt.verify.called).to.be.true
    jwt.verify.restore()
  })
})
