import { useState } from "react";
import { createComments } from "../../router/comment";
import "./CommentForm.css";

const CommentForm = ({ pinId, onCommentSubmitted, canLeaveComment }) => {
  const [commentText, setCommentText] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!commentText.trim()) {
      newErrors.commentText = "Cannot send an empty comment";
    } else if (commentText.length > 225) {
      newErrors.commentText = "Comments cannot exceed 225 characters";
    }

    return newErrors;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const commentData = {
      comment: commentText.trim(),
    };

    try {
      const newComment = await createComments(pinId, commentData);
      onCommentSubmitted(newComment);
      setCommentText("");
      setIsSubmitted(false);
      setErrors({});
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  const handleChange = (e) => {
    const newCommentText = e.target.value;
    setCommentText(newCommentText);

    if (isSubmitted) {
      const newErrors = validate();
      setErrors(newErrors);
    }
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(e)
    }
  }

  if (!canLeaveComment) return null;

  return (
    <div className="comment-form-container">
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <div className="textarea-container">
          <textarea
            value={commentText}
            onChange={handleChange}
            onKeyDown={handleEnterKey}
            placeholder="Leave a comment!"
            rows={1}
            className="comment-textarea"
          />
          <button className="leave-comment-submit-button" type="submit">
            Send
          </button>
        </div>
        {errors.commentText && (
          <div className="error-container-comments">
            <p>{errors.commentText}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CommentForm;
