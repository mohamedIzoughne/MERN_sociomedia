import { MdLightMode, MdLogout } from "react-icons/md"
import { BiSolidCommentDetail, BiX } from "react-icons/bi"
import { IoNotifications } from "react-icons/io5"
import { AiFillQuestionCircle } from "react-icons/ai"
import { BiMenu } from "react-icons/bi"
import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { context } from "../store/context"
import Overlay from "../UI/Overlay"

const MainNavigation = () => {
  const [navIsOpen, setNavIsOpen] = useState(false)
  const { logoutHandler } = useContext(context)
  const toggleNav = () => {
    setNavIsOpen((prev) => !prev)
  }

  return (
    <>
      {navIsOpen && <Overlay onClick={toggleNav} />}
      <nav className="main-navigation sticky top-0 z-50">
        <div className="container py-3 flex items-center">
          <div className="logo">
            <Link to="/">
              <h2 className="text-main text-3xl cursor-pointer">SocioMedia</h2>
            </Link>
          </div>
          <div className="search mr-auto">
            <input
              type="search"
              className="bg-secondary p-1 pl-3 ml-2 outline-none rounded-lg hidden sm:block"
              placeholder="Search"
            />
          </div>
          {navIsOpen && (
            <ul className="absolute top-[76px] left-0 bg-white w-full py-3 border-slate-100 border-t border-solid">
              <li className="p-2 cursor-pointer text-xl rounded-sm hover:bg-secondary flex items-center gap-3 mx-3">
                <MdLightMode />
                <p>Light Mode</p>
                {/* <p className='ml-3'>Light/Dark mode</p> */}
              </li>
              <li className="p-2 cursor-pointer text-xl mx-3 rounded-sm hover:bg-secondary flex items-center gap-3">
                <BiSolidCommentDetail />
                <p>Comments</p>
              </li>
              <li className="p-2 cursor-pointer text-xl mx-3 rounded-sm hover:bg-secondary flex items-center gap-3">
                <IoNotifications />
                <p>Notifications</p>
              </li>
              <li className="p-2 cursor-pointer text-xl mx-3 rounded-sm hover:bg-secondary flex items-center gap-3">
                <AiFillQuestionCircle />
                <p>Help</p>
              </li>
              <li className="">
                <a
                  className="p-2 cursor-pointer text-xl mx-3 rounded-sm hover:bg-secondary flex items-center gap-3"
                  onClick={logoutHandler}
                >
                  <MdLogout />
                  <p>Log out</p>
                </a>
              </li>
            </ul>
          )}
          <div className="menu-button p-2 cursor-pointer text-4xl mr-3 rounded-full flex items-center">
            <button onClick={toggleNav}>
              {navIsOpen ? <BiX /> : <BiMenu />}
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default MainNavigation
