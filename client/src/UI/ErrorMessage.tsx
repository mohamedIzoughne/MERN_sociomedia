import React from "react"
import { BiError } from "react-icons/bi"
import classes from "./ErrorMessage.module.css"

type propsType = {
  message: string
  toggleModal: () => void
}

const ErrorMessage: React.FC<propsType> = ({ message, toggleModal }) => {
  return (
    <div
      className={`absolute left-1/2 top-1/3 text-center bg-white px-7 py-14 transform -translate-x-1/2 -translate-y-1/2 shadow-lg z-30 ${classes.modal}`}
    >
      <BiError className="mx-auto text-6xl text-[#f62136]" />
      <p className="my-8">
        <span>{message}</span>
      </p>
      <button
        className="bg-[#f0e1a4] text-[#505847] px-5 py-3 rounded-sm hover:bg-[#ffeeab] duration-100"
        onClick={toggleModal}
      >
        Try Again
      </button>
    </div>
  )
}

export default ErrorMessage
