import user_avatar from "../../images/user_avatar.png"
import { CiImageOn } from "react-icons/ci"
import { LuFileVideo } from "react-icons/lu"
import { AiOutlinePaperClip, AiOutlineAudio } from "react-icons/ai"
import useHttp from "../../hooks/use-http"
import { useContext, useRef, useState } from "react"
import { context } from "../../store/context"

const PostPublish: React.FC<{ updatePosts: () => void }> = ({
  updatePosts,
}) => {
  const [postContent, setPostContent] = useState<string | undefined>()
  const [postImage, setPostImage] = useState<File>()
  const postInputRef = useRef<HTMLTextAreaElement>(null)
  const { sendData } = useHttp()
  const { token } = useContext(context)

  const postImageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.currentTarget.files
    if (filesList) setPostImage(filesList[0])
  }

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault()
    const content = postInputRef.current!.value

    const formData = new FormData()

    formData.append("content", content)
    if (postImage) {
      formData.append("image", postImage)
    }

    const options = {
      headers: {
        Authorization: "Bearer " + token,
      },
      method: "POST",
      body: formData,
    }

    sendData<object>("feed/new-post", options, () => {
      updatePosts()
      setPostContent("")
    })
  }

  const postUploadClickHandler = () => {
    document.getElementById("upload-file")?.click()
  }

  const postContentChangeHandler = () => {
    setPostContent(postInputRef.current?.value)
  }

  return (
    <form className="bg-white mb-7 p-3 rounded-md" onSubmit={formSubmitHandler}>
      <div className="post flex items-center border-b-2 border-solid border-secondary pb-3 flex-wrap">
        <div className="image-holder w-14 h-14 rounded-full overflow-hidden mx-auto mb-2 sm:mb-0">
          <img src={user_avatar} alt="profile image" />
        </div>
        <textarea
          ref={postInputRef}
          value={postContent}
          onChange={postContentChangeHandler}
          className="bg-secondary outline-none flex-grow  p-4 ml-3 rounded-2xl h-20 resize-none overflow-hidden"
          placeholder="What's on your mind ?"
        ></textarea>
      </div>
      <div className="image-holder text-center">
        {postImage && (
          <img src={URL.createObjectURL(postImage)} alt="" className="w-1/3" />
        )}
      </div>
      <div className="">
        <ul className="flex justify-between items-center mt-2">
          <li className="cursor-pointer flex items-center">
            <button
              type="button"
              id="post-upload-btn"
              onClick={postUploadClickHandler}
            >
              <CiImageOn className="inline-block mr-2" />
              <span>image</span>
            </button>
            <input
              type="file"
              id="upload-file"
              onChange={postImageChangeHandler}
              className="hidden"
            />
          </li>
          <li className="cursor-pointer hidden sm:flex">
            <LuFileVideo />
            <small className="ml-1">Clip</small>
          </li>
          <li className="cursor hidden pointer sm:flex">
            <AiOutlinePaperClip />
            <small className="ml-1">Attachment</small>
          </li>
          <li className="cursor-pointer hidden sm:flex">
            <AiOutlineAudio />
            <small className="ml-1">Audio</small>
          </li>
          <li>
            <button
              type="submit"
              className="py-2 px-3 bg-[#AEE2FF] rounded-full"
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
