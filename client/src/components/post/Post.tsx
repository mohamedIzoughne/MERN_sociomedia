import { BsPersonPlus, BsFillPersonCheckFill } from "react-icons/bs"
import { BiComment } from "react-icons/bi"
import { AiOutlineLike, AiFillLike } from "react-icons/ai"
import React, { useContext, useState } from "react"
import { context } from "../../store/context"
import useHttp from "../../hooks/use-http"
import { Link } from "react-router-dom"
import Comments from "./Comments"
import { friendType, postType } from "../../App"

type propsType = {
  post: postType
  addFriendHandler: (id: string) => void
  friends: friendType[] | []
  isFriendAdded: boolean
}

const Post: React.FC<propsType> = ({
  post,
  addFriendHandler,
  isFriendAdded,
}) => {
  const { token, userId } = useContext(context)
  const { sendData } = useHttp()
  const [postIsLiked, setPostIsLiked] = useState<boolean>(post.likedByUser)
  const [showComments, setShowComments] = useState(false)
  const [currentPost, setCurrentPost] = useState(post)
  const [likes, setLikes] = useState<number>(Object.keys(post.likes).length)
  const friendHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const friendId = e.currentTarget.dataset.creator_id
    if (friendId) addFriendHandler(friendId)
  }

  const postHandler = ({ post }: { post: postType }) => {
    setCurrentPost(post)
  }

  const toggleLikeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    let action
    if (!postIsLiked) {
      action = "increment"
      setLikes((likes) => likes + 1)
    } else {
      action = "decrement"
      setLikes((likes) => likes - 1)
    }
    setPostIsLiked((prev) => !prev)

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ action }),
    }

    const postId = e.currentTarget.dataset.post_id

    sendData(`feed/update-like/${postId}`, options, () => {})
  }

  const checkIfNotUser = (id: string) => {
    return id !== userId
  }

  const showHideCommentsHandler = () => {
    setShowComments((prev) => !prev)
  }

  return (
    <li className="bg-white p-3 rounded-md mb-5">
      <div className="flex pb-3 items-center rounded-md">
        <div className="image w-14 h-14 overflow-hidden rounded-full">
          <img
            src={`${
              import.meta.env.VITE_SERVER_API
                ? import.meta.env.VITE_SERVER_API +
                  (post.creator.imageUrl || "")
                : ""
            } `}
            alt=""
          />
        </div>
        <div className="info">
          <Link
            to={`/user/${currentPost.creator.id}`}
            className="inline-block ml-3"
          >
            <h3 className="-mb-1 leading-none">{currentPost.creator.name}</h3>
            <small className="text-gray-400">
              {currentPost.creator.location}
            </small>
          </Link>
        </div>
        <div className="ml-auto cursor-pointer rounded-full duration-75 bg-[#f4fbffa0] hover:bg-[#e9f5fd]">
          {checkIfNotUser(currentPost.creator.id) && (
            <button
              className="p-2"
              data-creator_id={currentPost.creator.id}
              onClick={friendHandler}
            >
              {isFriendAdded ? <BsFillPersonCheckFill /> : <BsPersonPlus />}
            </button>
          )}
        </div>
      </div>
      <div className="content  px-3">
        <p className="mb-2">{currentPost.content}</p>
        <div className="flex justify-center">
          {post?.imageUrl ? (
            <img
              src={`${
                (import.meta.env.VITE_SERVER_API || "") +
                (currentPost.imageUrl || "")
              }`}
              alt=""
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="reaction py-3 text-2xl flex items-center gap-1 ml-3">
        <button
          data-post_id={currentPost._id}
          className="cursor-pointer"
          onClick={toggleLikeHandler}
        >
          {postIsLiked ? (
            <AiFillLike className="text-[#217aea]" />
          ) : (
            <AiOutlineLike />
          )}
        </button>
        <small>{likes}</small>
        <button
          className="cursor-pointer ml-3"
          onClick={showHideCommentsHandler}
        >
          <BiComment className="cursor-pointer ml-3" />
        </button>
        <small>{currentPost.comments.length}</small>
      </div>
      {showComments && (
        <Comments
          onComment={postHandler}
          postId={currentPost._id}
          comments={currentPost.comments}
        />
      )}
    </li>
  )
}

export default Post
