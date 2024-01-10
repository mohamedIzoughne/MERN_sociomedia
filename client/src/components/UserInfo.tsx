import { IoLocationOutline } from "react-icons/io5"
import { MdWorkOutline } from "react-icons/md"
import { BsLinkedin, BsTwitter, BsPersonFillGear } from "react-icons/bs"
import { BiSolidEditAlt } from "react-icons/bi"
import { Link, useLocation } from "react-router-dom"
import { socialType } from "../pages/Home"
import { userType } from "../App"

const UserInfo: React.FC<{
  user?: userType
  isSettingsHidden?: boolean
  onDetails: () => void
  onSocial: () => void
  onSetProfile: (profile: socialType) => void
}> = ({ user, onDetails, onSocial, onSetProfile, isSettingsHidden }) => {
  const { pathname: path } = useLocation()
  const classes = `bg-white p-3 rounded-md ${
    path === "/" && " w-1/4 hidden flex-grow md:block lg:flex-grow-0"
  } ${
    path !== "/" && "w-1/3  flex-grow w-min-[180px] hidden xsm:block"
  } sticky top-[88px]`

  const socialProfileHandler = (profile: socialType) => {
    onSetProfile(profile)
    onSocial()
  }

  return (
    <section className={classes}>
      <div className="row flex items-center border-b-2 border-secondary border-solid pb-3">
        <Link className="flex items-center" to={`/user/${user?._id}`}>
          <div className="image-holder w-14 h-14 overflow-hidden rounded-full">
            <img src={`http://localhost:3000/${user?.imageUrl}`} alt="" />
          </div>
          <div className="info pl-3">
            <h3 className="leading-none">{user?.fullName}</h3>
            <small className="text-gray-300 font-bold">
              {user?.friends?.length} friends
            </small>
          </div>
        </Link>
        {!isSettingsHidden && (
          <button
            className="settings-icon ml-auto cursor-pointer"
            onClick={onDetails}
          >
            <BsPersonFillGear />
          </button>
        )}
      </div>
      <div className="border-b-2 border-solid border-secondary pb-3">
        <p className="location flex items-center py-3">
          <IoLocationOutline />
          <small className="text-gray-400 ml-2">{user?.location}</small>
        </p>
        <p className="work flex items-center">
          <MdWorkOutline />
          <small className=" text-gray-400 ml-2">{user?.work}</small>
        </p>
      </div>
      <div className="border-b-2 border-solid border-secondary py-2">
        <p className="text-gray-400 flex py-2 text-sm">
          Whose viewed your profile:
          <b className="ml-auto text-black">{34}</b>
        </p>
        <p className="text-gray-400 flex pb-2 text-sm">
          Whose viewed your profile:
          <b className="ml-auto text-black">{35}</b>
        </p>
      </div>
      <div className="mt-3">
        <h3>
          <b>Social Profiles</b>:
        </h3>
        <ul>
          <li className="twitter flex pb-5 pt-3 items-center">
            <div className="logo">
              <BsTwitter size="1.5rem" />
            </div>
            <div className="info">
              <a
                className="inline-block ml-3 cursor-pointer"
                onClick={() => socialProfileHandler("twitter")}
              >
                <h3 className="-mb-2">Twitter</h3>
                <small className="text-gray-400">Social platform</small>
              </a>
            </div>
            <BiSolidEditAlt className="ml-auto" />
          </li>
          <li className="linkedIn flex pb-3 items-center">
            <div className="logo">
              <BsLinkedin size="1.5rem" />
            </div>
            <div className="info">
              <a
                className="inline-block ml-3 cursor-pointer"
                onClick={() => socialProfileHandler("linkedin")}
              >
                <h3 className="-mb-2">Linkedin</h3>
                <small className="text-gray-400">Social platform</small>
              </a>
            </div>
            <BiSolidEditAlt className="ml-auto" />
          </li>
        </ul>
      </div>
    </section>
  )
}

export default UserInfo
