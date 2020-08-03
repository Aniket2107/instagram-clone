import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import firebase from "firebase";
import { Avatar } from "@material-ui/core";
import "./Posts.css";

const Posts = ({ postId, user, username, caption, imageUrl }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const addComment = (e) => {
    e.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  return (
    <div className="post">
      <div className="post_header">
        <Avatar className="post_avatar" src="" alt="postAvatar" />
        <h3>{username}</h3>
      </div>
      <img className="post_image" src={imageUrl} alt="postimg" />
      <h4 className="post_text">
        <strong>{username}</strong> : {caption}
      </h4>

      <div className="post_comments">
        {comments.map((cmt) => {
          return (
            <span>
              <strong>{cmt.username}</strong> {cmt.text}
            </span>
          );
        })}
      </div>
      {user && (
        <form className="post_commentBox">
          <input
            className="post_input"
            type="text"
            placeholder="Add a comment"
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post_button"
            disabled={!comment}
            type="submit"
            onClick={addComment}
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
};

export default Posts;
