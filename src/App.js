import React, { useState, useEffect } from "react";
import "./App.css";
import Posts from "./Components/Posts";
import UploadFiles from "./Components/UploadFiles";
import { db, auth } from "./firebase";
import { Modal, makeStyles, Button, Input } from "@material-ui/core";

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}% , -${left}%)`,
  };
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 500,
    backgroundColor: "white",
    border: "2px solid #000",
    boxShadow: "theme.shadow[5]",
    padding: "5px",
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          //Do not update anything
        } else {
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamps", "desc")
      .onSnapshot((snapshot) => {
        // setPosts(snapshot.docs.map((doc) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((athUser) => {
        alert("User registered");
        return athUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => alert("User LoggedIn! "))
      .catch((error) => alert(error.message));

    setLoginOpen(false);
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_form">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="insta-logo"
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}>Register</Button>
          </form>
        </div>
      </Modal>

      {/* Login Modal */}
      <Modal open={loginOpen} onClose={() => setLoginOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_form">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="insta-logo"
              />
            </center>
            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}>Login</Button>
          </form>
        </div>
      </Modal>

      {/* End of login modal */}
      <div className="app_header">
        <img
          classsName="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="insta logo"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div>
            <Button onClick={() => setLoginOpen(true)}>Login</Button>
            <Button onClick={() => setOpen(true)}>Register</Button>
          </div>
        )}
      </div>
      <div className="app_postsDisplay">
        {posts.map(({ id, post }) => {
          return (
            <Posts
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          );
        })}
      </div>
      {user?.displayName ? (
        <UploadFiles username={user.displayName} />
      ) : (
        <h3>login to upload</h3>
      )}
    </div>
  );
}

export default App;
