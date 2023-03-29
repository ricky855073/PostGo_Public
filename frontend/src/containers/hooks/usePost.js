import { useState, useEffect, createContext, useContext } from "react";
import { message } from "antd";
const LOCALSTORAGE_ACCOUNT = "save-account";
const LOCALSTORAGE_JWT = "save-JWT";
const LOCALSTORAGE_BulNow = "save-BulNow";
const LOCALSTORAGE_Image = "save-Image";
const LOCALSTORAGE_Nickname = "save-Nickname";
const PostContext = createContext({
  account: "",
  setAccount: () => {},
  userModal: false,
  setUserModal: () => {},
  posts: [],
  setPosts: () => {},
});

const PostProvider = (props) => {
  const savedAccount = localStorage.getItem(LOCALSTORAGE_ACCOUNT);
  const savedJWT = localStorage.getItem(LOCALSTORAGE_JWT);
  const savedBulNow = localStorage.getItem(LOCALSTORAGE_BulNow);
  const savedImage = localStorage.getItem(LOCALSTORAGE_Image);
  const savedNickname = localStorage.getItem(LOCALSTORAGE_Nickname);
  const [account, setAccount] = useState(savedAccount || "");
  const [JWT, setJWT] = useState(savedJWT || "");

  const [bulletinName, setBulletinName] = useState("");
  const [userModal, setUserModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [nickname, setNickname] = useState(savedNickname || "");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(savedImage || 1);
  const [badge, setBadge] = useState(0);
  const [title, setTitle] = useState(0);
  const [achievement, setAchievement] = useState("");
  const [focusedBulletin, setFocusedBulletin] = useState(savedBulNow || 0);
  const [located, setLocated] = useState(true);
  const [circle, setCircle] = useState(false);
  const [distance, setDistance] = useState(false);
  const [gear, setGear] = useState(false);
  const logout = () => {
    setAccount("");
    localStorage.clear();
  };
  const displayStatus = (s) => {
    if (s["status"]) message.success(s["message"]);
    else message.error(s["message"]);
  };
  useEffect(() => {
    if (account) {
      localStorage.setItem(LOCALSTORAGE_ACCOUNT, account);
    } else {
      localStorage.setItem(LOCALSTORAGE_ACCOUNT, "");
    }
  }, [account]);
  useEffect(() => {
    if (JWT) {
      localStorage.setItem(LOCALSTORAGE_JWT, JWT);
    } else {
      localStorage.setItem(LOCALSTORAGE_JWT, "");
    }
  }, [JWT]);
  useEffect(() => {
    if (focusedBulletin) {
      localStorage.setItem(LOCALSTORAGE_BulNow, focusedBulletin);
    } else {
      localStorage.setItem(LOCALSTORAGE_BulNow, 0);
    }
  }, [focusedBulletin]);
  useEffect(() => {
    if (image) {
      localStorage.setItem(LOCALSTORAGE_Image, image);
    } else {
      localStorage.setItem(LOCALSTORAGE_Image, 1);
    }
  }, [image]);
  useEffect(() => {
    if (nickname) {
      localStorage.setItem(LOCALSTORAGE_Nickname, nickname);
    } else {
      localStorage.setItem(LOCALSTORAGE_Nickname, "");
    }
  }, [nickname]);
  // const []
  return (
    <PostContext.Provider
      value={{
        account,
        setAccount,
        JWT,
        setJWT,
        image,
        setImage,
        gear,
        setGear,
        circle,
        setCircle,
        located,
        setLocated,
        focusedBulletin,
        setFocusedBulletin,
        bulletinName,
        setBulletinName,
        nickname,
        setNickname,
        distance,
        setDistance,
        email,
        setEmail,
        userModal,
        setUserModal,
        posts,
        setPosts,
        logout,
        displayStatus,
      }}
      {...props}
    />
  );
};
const usePost = () => useContext(PostContext);
export { PostProvider, usePost };
