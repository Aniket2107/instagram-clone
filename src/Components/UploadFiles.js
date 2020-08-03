import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { storage, db } from "../firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function UploadFiles({ username }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handlefileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmitFile = () => {
    const UploadTask = storage.ref(`images/${image.name}`).put(image);

    UploadTask.on(
      "state_changed",
      (snapshot) => {
        const pgrs = Math.round(
          (snapshot.bytesTransferres / snapshot.totalBytes) * 100
        );
        setProgress(pgrs);
      },
      (error) => {
        //console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamps: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setImage(null);
            setCaption("");
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <center>
        <h3>Upload your photos and share with your friends :) </h3>
      </center>
      <p>Progress bar</p>
      <progress className="imageUpload_progress" value={progress} max="100" />
      <br />
      <p>Caption field</p>
      <input
        type="text"
        placeholder="Add a caption.."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <br />
      <p>Add your favourite photos here! and upload </p>
      <input type="file" onChange={handlefileChange} />
      <br />
      <Button onClick={onSubmitFile}>Upload</Button>
    </div>
  );
}

export default UploadFiles;
