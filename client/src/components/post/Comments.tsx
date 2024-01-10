import { useState } from "react"
import { commentsType } from "../../App"
import { BiPlus } from "react-icons/bi"
import AddComment from "./AddCommnets"
import ReactDOM from "react-dom"
import Overlay from "../../UI/Overlay"
import { postType } from "../../App"
type propTypes = {
  comments: commentsType
  postId: string
  onComment: ({ post }: { post: postType }) => void
}

const Comments: React.FC<propTypes> = ({ comments, postId, onComment }) => {
  const [commentAddIsShown, setCommentAddIsShown] = useState<boolean>(false)

  const toggleCommentAdd = () => {
    setCommentAddIsShown((prev) => !prev)
  }

  return (
    <section className="relative">
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => {
            return (
              <li key={comment._id} className="p-2 border-t-2 border-slate-100">
                {comment.content}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-center p-3 font-semibold">There is no comments !</p>
      )}
      <button
        onClick={toggleCommentAdd}
        className="bg-main text-lg p-2 absolute -bottom-7 left-1/2 transform -translate-x-1/2 rounded-full"
      >
        <BiPlus />
      </button>
      {commentAddIsShown &&
        ReactDOM.createPortal(
          <>
            <Overlay onClick={toggleCommentAdd} />{" "}
            <AddComment
              onComment={onComment}
              onToggle={toggleCommentAdd}
              postId={postId}
            />
          </>,
          document.getElementById("modals")!
        )}
    </section>
  )
}

export default Comments
