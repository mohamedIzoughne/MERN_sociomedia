import React, { FormEvent, useContext, useRef } from "react"
import { BsTwitter, BsLinkedin } from "react-icons/bs"
import { FaEdit } from "react-icons/fa"
import { socialType } from "../pages/Home"
import useHttp from "../hooks/use-http"
import { context } from "../store/context"

type socialMediaType = {
  [key: string]: React.ReactElement
}

type propsType = {
  profile: socialType
  onToggle: () => void
  isReadOnly: boolean
  profiles:
    | {
        [key: string]: string
      }
    | undefined
  updateUser?: () => void
}

const socialMedia: socialMediaType = {
  twitter: <BsTwitter />,
  linkedin: <BsLinkedin />,
}

const EditSocialProfile: React.FC<propsType> = ({
  profile,
  onToggle,
  isReadOnly,
  profiles,
  updateUser,
}) => {
  const { sendData } = useHttp()
  const accountInputRef = useRef<HTMLInputElement | null>(null)
  const { token } = useContext(context)
  const initialAccount = profiles && profiles[profile]

  const formSubmitHandler = (e: FormEvent) => {
    e.preventDefault()
    onToggle()
    const account = accountInputRef?.current?.value
    let platform
    switch (profile) {
      case "twitter":
        platform = { twitter: account }
        break
      case "linkedin":
        platform = { linkedin: account }
        break
    }

    const options = {
      method: "POST",
      body: JSON.stringify({
        platform,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
    if (isReadOnly || account?.trim() === "" || account === initialAccount)
      return

    sendData("profile/post-account", options, () => {
      if (updateUser) updateUser()
    })
  }

  return (
    <section
      className="w-[440px] bg-white max-w-[95%] mx-auto p-[10px] rounded-md fixed z-30 top-20 
  left-1/2 transform -translate-x-1/2 shadow-md border border-[#dad9d9ab]"
    >
      <div
        className="profile-icons text-[70px] 
        flex justify-center"
      >
        {socialMedia[profile]}
      </div>
      <form onSubmit={formSubmitHandler}>
        <div className="form-control relative w-[333px] w-max-full h-[47px] mx-auto mt-[17px]">
          {isReadOnly ? (
            <input
              type="text"
              name=""
              id=""
              className="border 
            border-[#c2c2c2ab] text-[#3F3F3F] cursor-pointer"
              placeholder={(profiles && profiles[profile]) || profile + ".com"}
              readOnly
            />
          ) : (
            <input
              type="text"
              name=""
              id=""
              className="border 
      border-[#c2c2c2ab] text-[#3F3F3F]"
              ref={accountInputRef}
              placeholder={(profiles && profiles[profile]) || profile + ".com"}
            />
          )}
          {!isReadOnly && (
            <span>
              <FaEdit
                className="absolute right-[10px] top-[50%] transform -translate-y-3/4 
            text-[#8f8f8fa9]"
              />
            </span>
          )}
        </div>
        {!isReadOnly && (
          <button
            className="w-[62px] block h-[32px] rounded-md bg-main bold ml-auto mt-2"
            type="submit"
          >
            Save
          </button>
        )}
      </form>
    </section>
  )
}

export default EditSocialProfile
