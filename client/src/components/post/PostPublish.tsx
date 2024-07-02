import ReactDOM from 'react-dom'
import { CiImageOn } from 'react-icons/ci'
import { LuFileVideo } from 'react-icons/lu'
import { AiOutlinePaperClip, AiOutlineAudio } from 'react-icons/ai'
import useHttp from '../../hooks/use-http'
import { useContext, useRef, useState } from 'react'
import { context } from '../../store/context'
import Media from '../../UI/Media'
import { Link } from 'react-router-dom'
import Overlay from '../../UI/Overlay'
import Loader from '../../UI/Loader'
import ErrorMessage from '../../UI/ErrorMessage'

const PostPublish: React.FC<{ updatePosts: () => void }> = ({
  updatePosts,
}) => {
  const [postContent, setPostContent] = useState<string | undefined>()
  const [postFile, setPostFile] = useState<File | null>()
  const postInputRef = useRef<HTMLInputElement>(null)
  const { sendData, isLoading, errorMessage, setErrorMessage } = useHttp()
  const { token, userId, user, postPublishIsShown, togglePostPublishIsShown } =
    useContext(context)

  const postFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.currentTarget.files
    if (filesList) setPostFile(filesList[0])
  }

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault()
    const content = postInputRef.current!.value
    const formData = new FormData()

    formData.append('content', content)
    if (postFile) {
      formData.append('image', postFile)
    }

    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'POST',
      body: formData,
    }

    sendData<object>('feed/new-post', options, () => {
      updatePosts()
      setPostContent('')
      setPostFile(null)
    })
  }

  const postUploadClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    document
      .getElementById(e.currentTarget.getAttribute('data-clickId')!)
      ?.click() // I should use ref
  }

  const postContentChangeHandler = () => {
    setPostContent(postInputRef.current?.value)
  }

  const toggleModal = () => {
    setErrorMessage('')
  }

  return (
    <form
      className={
        'bg-white dark:bg-[#303030] mb-7 p-3 rounded-sm' +
        (postPublishIsShown && ' sticky top-[100px] z-50')
      }
      onSubmit={formSubmitHandler}
    >
      {isLoading && <Loader />}
      {errorMessage &&
        ReactDOM.createPortal(
          <>
            <Overlay onClick={toggleModal} />
            <ErrorMessage message={errorMessage} toggleModal={toggleModal} />
          </>,
          document.getElementById('modals')!
        )}
      {postPublishIsShown &&
        ReactDOM.createPortal(
          <>
            <Overlay onClick={togglePostPublishIsShown} />
          </>,
          document.getElementById('modals')!
        )}
      <div className='post flex items-center border-b-2 border-solid border-secondary pb-3 flex-wrap'>
        <Link to={'/user/' + userId}>
          <div className='file-holder w-14 h-14 rounded-full overflow-hidden mx-auto mb-2 sm:mb-0'>
            <img
              src={(import.meta.env.VITE_SERVER_API || '') + user.imageUrl}
              alt='profile image'
            />
          </div>
        </Link>
        <input
          ref={postInputRef}
          value={postContent}
          dir='auto'
          onChange={postContentChangeHandler}
          className='bg-secondary dark:bg-[#595959]  outline-none flex-grow  p-4 ml-3 rounded-sm  resize-none overflow-hidden'
          placeholder="What's on your mind ?"
        ></input>
      </div>
      <div className='file-holder text-center'>
        {postFile && (
          // <img src={URL.createObjectURL(postFile)} alt='' className='w-1/3' />
          <Media
            fileUrl={URL.createObjectURL(postFile)}
            type={postFile.type.split('/')[0]}
          />
        )}
      </div>
      <div className=''>
        <ul className='flex justify-between items-center mt-2'>
          <li className='cursor-pointer flex items-center'>
            <button
              type='button'
              id='post-upload-btn'
              data-clickId='upload-image'
              onClick={postUploadClickHandler}
            >
              <CiImageOn className='inline-block mr-2' />
              <span>image</span>
            </button>
            <input
              type='file'
              id='upload-image'
              onChange={postFileChangeHandler}
              className='hidden'
              accept='image/jpeg, image/png, image/gif, image/bmp, image/webp, image/tiff, image/svg+xml'
            />
          </li>
          <li className='cursor-pointer hidden sm:flex'>
            <button
              type='button'
              id='post-upload-btn'
              data-clickId='upload-video'
              onClick={postUploadClickHandler}
            >
              <LuFileVideo className='inline-block mr-2' />
              <span>clip</span>
            </button>
            <input
              type='file'
              id='upload-video'
              onChange={postFileChangeHandler}
              className='hidden'
              accept='video/mp4, video/mpeg, video/ogg, video/webm'
            />
          </li>
          <li className='cursor hidden pointer sm:flex'>
            <button
              type='button'
              id='post-upload-btn'
              data-clickId='upload-document'
              onClick={postUploadClickHandler}
            >
              <AiOutlinePaperClip className='inline-block mr-2' />
              <span>Document</span>
            </button>
            <input
              type='file'
              id='upload-document'
              onChange={postFileChangeHandler}
              className='hidden'
              accept='application/pdf, text/plain, application/rtf'
            />
          </li>
          <li className='cursor-pointer hidden sm:flex'>
            <button
              type='button'
              id='post-upload-btn'
              data-clickId='upload-audio'
              onClick={postUploadClickHandler}
            >
              <AiOutlineAudio className='inline-block mr-2' />
              <span>Audio</span>
            </button>
            <input
              type='file'
              id='upload-audio'
              onChange={postFileChangeHandler}
              className='hidden'
              accept='audio/mpeg, audio/wav, audio/ogg, audio/mp4, audio/aac, audio/x-m4a'
            />
          </li>
          <li>
            <button
              type='submit'
              className='py-2 px-3 bg-main text-white rounded-sm w-16'
            >
              Post
            </button>
          </li>
        </ul>
      </div>
    </form>
  )
}

export default PostPublish
