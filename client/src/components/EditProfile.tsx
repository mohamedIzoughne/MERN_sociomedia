import { FormEvent, useContext, useRef } from "react"
import { FaEdit } from "react-icons/fa"
import { userType } from "../App.tsx"
import useHttp from "../hooks/use-http.tsx"
import { context } from "../store/context.tsx"

const EditProfile: React.FC<{
  onClick: () => void
  user?: userType
  updateUser?: () => void
}> = ({ onClick: clickHandler, user, updateUser }) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const fullNameInputRef = useRef<HTMLInputElement | null>(null)
  const emailInputRef = useRef<HTMLInputElement | null>(null)
  const locationInputRef = useRef<HTMLInputElement | null>(null)
  const jobInputRef = useRef<HTMLInputElement | null>(null)
  const { sendData } = useHttp()
  const { token } = useContext(context)

  const formSubmitHandler = (e: FormEvent) => {
    e.preventDefault()
    clickHandler()

    const userInfo = {
      fullName: fullNameInputRef?.current?.value?.trim() || "",
      email: emailInputRef?.current?.value?.trim() || "",
      location: locationInputRef?.current?.value?.trim() || "",
      work: jobInputRef?.current?.value?.trim() || "",
    }

    const form = new FormData()
    let key: keyof typeof userInfo
    for (key in userInfo) {
      form.append(key, userInfo[key])
    }
    if (imageInputRef?.current?.files) {
      form.append("image", imageInputRef?.current?.files[0])
    }

    const options = {
      method: "POST",
      body: form,
      headers: {
        Authorization: "Bearer " + token,
      },
    }

    sendData("profile/edit-profile", options, () => {
      updateUser!()
    })
  }

  return (
    <section
      className="w-[440px] bg-white max-w-full mx-auto p-[10px] rounded-md fixed z-30 top-20 
    left-1/2 transform -translate-x-1/2 shadow-md border border-[#dad9d9ab]"
    >
      <div className="flex items-end">
        <div
          className="profile-image mx-auto rounded-full w-[85px] h-[85px] overflow-hidden 
        text-center"
        >
          <img
            src={`${
              import.meta.env.VITE_SERVER_API
                ? import.meta.env.VITE_SERVER_API + (user?.imageUrl || "")
                : ""
            } `}
            alt=""
          />
        </div>
        <input type="file" ref={imageInputRef} />
      </div>
      <form onSubmit={formSubmitHandler}>
        <div className="form-control relative w-[333px] h-[47px] mx-auto mt-[17px]">
          <input
            type="text"
            name=""
            id=""
            className="border 
            border-[#c2c2c2ab] text-[#3F3F3F]"
            placeholder={user?.fullName}
            ref={fullNameInputRef}
          />
          <span>
            <FaEdit className="absolute right-[10px] top-[50%] transform -translate-y-3/4 text-[#8f8f8fa9]" />
          </span>
        </div>
        <div className="form-control relative w-[333px] h-[47px] mx-auto mt-[17px]">
          <input
            type="email"
            name=""
            id=""
            className="border 
            border-[#c2c2c2ab] text-[#3F3F3F]"
            placeholder={user?.email}
            ref={emailInputRef}
          />
          <span>
            <FaEdit className="absolute right-[10px] top-[50%] transform -translate-y-3/4 text-[#8f8f8fa9]" />
          </span>
        </div>
        <div className="form-control relative w-[333px] h-[47px] mx-auto mt-[17px]">
          <input
            type="text"
            name=""
            id=""
            className="border 
            border-[#c2c2c2ab] text-[#3F3F3F]"
            placeholder={user?.location}
            ref={locationInputRef}
          />
          <span>
            <FaEdit className="absolute right-[10px] top-[50%] transform -translate-y-3/4 text-[#8f8f8fa9]" />
          </span>
        </div>
        <div className="form-control relative w-[333px] h-[47px] mx-auto mt-[17px]">
          <input
            type="text"
            name=""
            id=""
            className="border 
            border-[#c2c2c2ab] text-[#3F3F3F]"
            placeholder={user?.work}
            ref={jobInputRef}
          />
          <span>
            <FaEdit className="absolute right-[10px] top-[50%] transform -translate-y-3/4 text-[#8f8f8fa9]" />
          </span>
        </div>
        <button
          className="w-[82px] block h-[42px] rounded-md bg-main bold ml-auto my-4"
          type="submit"
        >
          Save
        </button>
      </form>
    </section>
  )
}

export default EditProfile
// function sendData(
//   arg0: string,
//   options: { method: string; body: FormData },
//   arg2: () => void
// ) {
//   throw new Error("Function not implemented.")
// }
