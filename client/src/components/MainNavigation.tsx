import React from 'react'
import { MdLightMode, MdLogout, MdDarkMode } from 'react-icons/md'
import { BiSolidCommentDetail, BiX } from 'react-icons/bi'
import { MdAddCircleOutline } from 'react-icons/md'
import { FaUserFriends } from 'react-icons/fa'
import { IoNotifications } from 'react-icons/io5'
import { AiFillQuestionCircle } from 'react-icons/ai'
import { BiMenu } from 'react-icons/bi'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { context } from '../store/context'
import Overlay from '../UI/Overlay'
import useHttp from '../hooks/use-http'
import { notificationType } from '../types'

type notificationCategoriesTypes = {
  [key: string]: string
}

const notificationCategories: notificationCategoriesTypes = {
  like: 'liked your post',
  comment: 'commented on your post',
  invitation: 'invited you to be friends, do you accept ?',
}

const MobileNavItem: React.FC<{
  title: string
  icon: JSX.Element
  onClick?: () => void
}> = ({ title, icon, onClick }) => {
  return (
    <li className=''>
      <a
        className='p-2 cursor-pointer text-xl mx-3 py-3 rounded-sm hover:bg-secondary dark:hover:bg-[#625f5f] flex items-center gap-3'
        onClick={onClick}
      >
        {icon}
        <p>{title}</p>
      </a>
    </li>
  )
}

const NavItem: React.FC<{
  icon: JSX.Element
  onClick?: () => void
  className?: string
}> = ({ icon, onClick, className = '' }) => {
  return (
    <li className='ml-2'>
      <a
        className={
          'cursor-pointer p-2 rounded-sm hover:bg-secondary dark:hover:bg-[#625f5f] flex items-center gap-3 text-2xl ' +
          className
        }
        onClick={onClick}
      >
        {icon}
      </a>
    </li>
  )
}

const MobileNav: React.FC<{ togglePublish: () => void }> = ({
  togglePublish,
}) => {
  const [navIsOpen, setNavIsOpen] = useState(false)
  const { logoutHandler, switchMode, isLightMode } = useContext(context)
  const toggleNav = () => {
    setNavIsOpen((prev) => !prev)
  }

  return (
    <>
      {navIsOpen && <Overlay className='z-10' onClick={toggleNav} />}
      <nav className='main-navigation sticky top-0 z-30 bg-white dark:bg-[#303030]'>
        <div className='container py-3 flex items-center'>
          <div className='logo mr-auto'>
            <Link to='/'>
              <h2 className='text-main text-3xl cursor-pointer font-cursive'>
                SocioMedia
              </h2>
            </Link>
          </div>
          {/* <div className='search mr-auto'>
            <input
              type='search'
              className='bg-secondary dark:bg-[#595959] p-1 pl-3 ml-2 outline-none rounded-sm hidden sm:block'
              placeholder='Search'
            />
          </div> */}
          {navIsOpen && (
            <ul
              className='absolute top-[76px] left-0 bg-white dark:bg-[#3c3c3c] w-full ml-auto py-3 
            border-slate-100 border-t-2 border-solid dark:border-none'
            >
              <MobileNavItem
                title={isLightMode ? 'Dark Mode' : 'Light Mode'}
                icon={isLightMode ? <MdLightMode /> : <MdDarkMode />}
                onClick={switchMode}
              />
              <MobileNavItem title='Comments' icon={<BiSolidCommentDetail />} />
              <MobileNavItem title='Notifications' icon={<IoNotifications />} />
              <Link to='friends'>
                <MobileNavItem title='Friends' icon={<FaUserFriends />} />
              </Link>
              <MobileNavItem title='Help' icon={<AiFillQuestionCircle />} />
              <MobileNavItem
                title='Logout'
                icon={<MdLogout />}
                onClick={logoutHandler}
              />
            </ul>
          )}
          <NavItem onClick={togglePublish} icon={<MdAddCircleOutline />} />
          <div className='menu-button p-2 cursor-pointer text-4xl mr-3 rounded-full flex items-center'>
            <button onClick={toggleNav}>
              {navIsOpen ? <BiX /> : <BiMenu />}
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

const NotificationItem: React.FC<{
  notification: notificationType
}> = ({ notification }) => {
  const { token } = useContext(context)
  const { type, creator } = notification
  const isInvitation = type === 'invitation'
  const { sendData } = useHttp()
  const [isShown, setIsShown] = useState(true)

  const acceptHandler = () => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ friendId: creator.id }),
    }

    setIsShown(false)
    sendData('profile/add-friend', options)
  }

  const refuseHandler = () => {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notificationId: notification._id }),
    }

    setIsShown(false) // optimistic
    sendData(`profile/refuse-friend`, options)
  }

  if (!isShown) return null

  return (
    <li className='border-b  border-gray-300 last:border-b-0 py-3 px-2 mb-2'>
      <div className='flex items-start justify-between'>
        <div className='image-holder w-[49px] h-[49px] mr-3 rounded-full'>
          <img
            src={import.meta.env.VITE_SERVER_API + creator.imageUrl}
            alt=''
          />
        </div>
        <p>
          <b>{creator.name}</b> {notificationCategories[type]}
        </p>
      </div>
      {isInvitation && (
        <div className='buttons w-fit ml-auto'>
          <button
            onClick={acceptHandler}
            className='accept w-[61px] h-[23px] bg-main text-white rounded-xs mr-3'
          >
            Yes
          </button>
          <button
            onClick={refuseHandler}
            className='decline w-[61px] h-[23px] bg-main text-white rounded-xs'
          >
            No
          </button>
        </div>
      )}
    </li>
  )
}

const Notifications = () => {
  const [isShown, setIsShown] = useState(false)
  const [notifications, setNotifications] = useState<notificationType[]>([])
  const [isNotified, setIsNotified] = useState<boolean>(false)
  const [chosenType, setChosenType] = useState('all')
  const { sendData } = useHttp()
  const { userId } = useContext(context)

  const toggleNotifications = () => {
    setIsShown((prev) => !prev)
    setIsNotified(false)
  }

  const sortNotifications = (e: React.MouseEvent<HTMLButtonElement>) => {
    setChosenType(e.currentTarget.dataset.value!)
  }

  const getNotifications = useCallback(() => {
    const options = {
      method: 'GET',
    }

    sendData<{ notifications: [] }>(
      `chat/notifications/${userId}`,
      options,
      (res) => {
        if (res) {
          setNotifications(res.notifications)
        }
      }
    )
  }, [sendData])

  useEffect(() => {
    getNotifications()
  }, [getNotifications])

  useEffect(() => {
    setIsNotified(notifications.length > 0)
  }, [notifications])

  return (
    <div className='relative'>
      <NavItem
        icon={<IoNotifications />}
        onClick={toggleNotifications}
        className={isNotified ? 'text-main' : ''}
      />
      {isShown && (
        <>
          <Overlay onClick={toggleNotifications} />
          <div className='content w-[338px] p-3  leading-none absolute z-20 right-0 bg-white dark:bg-[#303030] rounded-xs '>
            <div className='category-tabs mb-3'>
              <button
                onClick={sortNotifications}
                data-value='all'
                className={`tab all w-[50px] h-[44px] rounded-full border border-main border-solid hover:bg-main hover:border-white ${
                  chosenType === 'all' && 'bg-main border-white text-white'
                } hover:text-white duration-200 mr-2`}
              >
                All
              </button>
              <button
                onClick={sortNotifications}
                data-value='comment'
                className={`tab comments w-[105px] h-[44px] rounded-full border border-main border-solid hover:bg-main hover:border-white hover:text-white ${
                  chosenType === 'comment' && 'bg-main border-white text-white'
                } duration-200 mr-2`}
              >
                Comments
              </button>
              <button
                onClick={sortNotifications}
                data-value='invitation'
                className={`tab invitations w-[105px] h-[44px] rounded-full border border-main border-solid hover:bg-main hover:border-white hover:text-white ${
                  chosenType === 'invitation' &&
                  'bg-main border-white text-white'
                } duration-200`}
              >
                Invitations
              </button>
            </div>
            <ul className='body max-h-56 overflow-y-auto'>
              {notifications.map(
                (notification) =>
                  (notification.type === chosenType ||
                    chosenType === 'all') && (
                    <NotificationItem
                      notification={notification}
                      // type={notification.type}
                      // name={notification.creator.name}
                      // imageUrl={notification.creator.imageUrl}
                    />
                  )
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

const DesktopNav: React.FC<{ togglePublish: () => void }> = ({
  togglePublish,
}) => {
  const { logoutHandler, switchMode, isLightMode } = useContext(context)

  return (
    <>
      <nav className='main-navigation sticky top-0 z-10 bg-white dark:bg-[#303030]'>
        <div className='container py-3 flex items-center'>
          <div className='logo'>
            <Link to='/'>
              <h2 className='text-main text-3xl cursor-pointer font-cursive'>
                SocioMedia
              </h2>
            </Link>
          </div>
          <div className='search mr-auto'>
            <input
              type='search'
              className='bg-secondary dark:bg-[#595959] p-1 pl-3 ml-2 outline-none rounded-sm hidden sm:block'
              placeholder='Search'
            />
          </div>

          <ul className='flex bg-transparent py-3 pr-2 text-lg'>
            <NavItem onClick={togglePublish} icon={<MdAddCircleOutline />} />
            <NavItem
              icon={isLightMode ? <MdLightMode /> : <MdDarkMode />}
              onClick={switchMode}
            />
            <Link to='/friends'>
              <NavItem className='md:hidden' icon={<FaUserFriends />} />
            </Link>
            <NavItem icon={<BiSolidCommentDetail />} />
            <li className='notifications'>
              <Notifications />
            </li>
            <NavItem icon={<AiFillQuestionCircle />} />
            <NavItem icon={<MdLogout />} onClick={logoutHandler} />
          </ul>
        </div>
      </nav>
    </>
  )
}

const MainNavigation = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const { togglePostPublishIsShown } = useContext(context)
  useEffect(() => {
    const resizeHandler = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return (
    <>
      {width <= 640 ? (
        <MobileNav togglePublish={togglePostPublishIsShown} />
      ) : (
        <DesktopNav togglePublish={togglePostPublishIsShown} />
      )}
    </>
  )
}

export default React.memo(MainNavigation)
