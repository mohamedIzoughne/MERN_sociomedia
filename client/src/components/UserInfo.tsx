import { IoLocationOutline } from 'react-icons/io5'
import { MdWorkOutline } from 'react-icons/md'
import { BsLinkedin, BsTwitter, BsPersonFillGear } from 'react-icons/bs'
import { BiSolidEditAlt } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { socialType, userType } from '../types'
import { TiMessages } from 'react-icons/ti'
import { useContext } from 'react'
import { context } from '../store/context'

const UserInfo: React.FC<{
  user?: userType
  isHimself?: boolean
  onDetails: () => void
  onSocial: () => void
  onSetProfile: (profile: socialType) => void
  userPage?: true
}> = ({ user, onDetails, onSocial, onSetProfile, isHimself, userPage }) => {
  const { chatHandler, chatsHandler } = useContext(context)

  const classes = `bg-white dark:bg-[#303030] p-3 rounded-sm ${
    !userPage && ' w-1/4 hidden md:block lg:flex-grow-0 min-w-[250px]'
  } ${userPage && 'w-full sm:min-w-[350px]'} top-[88px]`

  const socialProfileHandler = (profile: socialType) => {
    if (!isHimself) return
    onSetProfile(profile)
    onSocial()
  }

  const onChatClickHandler = () => {
    chatHandler()
    chatsHandler(user!._id, user!.fullName, user!.imageUrl)
  }

  return (
    <section className={classes}>
      <div className='row flex items-center border-b-2 border-secondary border-solid pb-3'>
        <Link className='flex items-center' to={`/user/${user?._id}`}>
          <div className='image-holder w-14 h-14 overflow-hidden rounded-full'>
            <img
              className='w-full h-full object-cover'
              src={`${
                import.meta.env.VITE_SERVER_API
                  ? import.meta.env.VITE_SERVER_API + (user?.imageUrl || '')
                  : ''
              } `}
              alt=''
            />
          </div>
          <div className='info pl-3'>
            <h3 className='leading-none'>{user?.fullName}</h3>
            <small className='text-gray-300 font-bold'>
              {user?.friends?.length} friends
            </small>
          </div>
        </Link>
        {isHimself ? (
          <button className='settings-icon ml-auto' onClick={onDetails}>
            <BsPersonFillGear />
          </button>
        ) : (
          <button
            className='settings-icon ml-auto'
            onClick={onChatClickHandler}
          >
            <TiMessages />
          </button>
        )}
      </div>
      <div className='border-b-2 border-solid border-secondary pb-3'>
        <p className='location flex items-center py-3'>
          <IoLocationOutline />
          <small className='text-gray-400 ml-2'>{user?.location}</small>
        </p>
        <p className='work flex items-center'>
          <MdWorkOutline />
          <small className=' text-gray-400 ml-2'>{user?.work}</small>
        </p>
      </div>
      <div className='border-b-2 border-solid border-secondary py-2'>
        <p className='text-gray-400 dark:text-white flex py-2 text-sm'>
          Whose viewed your profile:
          <b className='ml-auto'>{user?.profileViews}</b>
        </p>
        <p className='text-gray-400 dark:text-white flex pb-2 text-sm'>
          Reactions on your post:
          <b className='ml-auto'>{user?.impressionsOnPosts}</b>
        </p>
      </div>
      <div className='mt-3'>
        <h3>
          <b>Social Profiles</b>:
        </h3>
        <ul>
          <li
            className='twitter flex pb-5 pt-3 items-center'
            onClick={() => socialProfileHandler('twitter')}
          >
            <div className='logo'>
              <BsTwitter size='1.5rem' />
            </div>
            <div className='info'>
              <a
                className={
                  isHimself
                    ? 'inline-block ml-3 cursor-pointer'
                    : 'inline-block ml-3'
                }
              >
                <h3 className='-mb-2'>Twitter</h3>
                <small className='text-gray-400'>Social platform</small>
              </a>
            </div>
            {isHimself && <BiSolidEditAlt className='ml-auto' />}
          </li>
          <li className='linkedIn flex pb-3 items-center'>
            <div className='logo'>
              <BsLinkedin size='1.5rem' />
            </div>
            <div className='info'>
              <a
                className={
                  isHimself
                    ? 'inline-block ml-3 cursor-pointer'
                    : 'inline-block ml-3'
                }
                onClick={() => socialProfileHandler('linkedin')}
              >
                <h3 className='-mb-2'>Linkedin</h3>
                <small className='text-gray-400'>Social platform</small>
              </a>
            </div>
            {isHimself && <BiSolidEditAlt className='ml-auto' />}
          </li>
        </ul>
      </div>
    </section>
  )
}

export default UserInfo
