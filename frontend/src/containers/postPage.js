import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Input, Button, Tag, Tabs } from "antd";
import { usePost } from "./hooks/usePost";
import { useNavigate } from "react-router-dom";
import "../utils/CSS/postPage.css";
import axios from "../utils/others/api";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UserModal from "./userModal";
import Parser from "html-react-parser";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ImgurUploaderInit from "ckeditor5-imgur-uploader";
// const ImgurUploaderInit = require("ckeditor5-imgur-uploader");
import viewToPlainText from "@ckeditor/ckeditor5-clipboard/src/utils/viewtoplaintext";
import DetailModal from "./detailModal";
import "../utils/CSS/post.scss";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #e4ebf5;
  height: 50%;
`;
const FootRef = styled.div`
  color: aqua;
  height: 20px;
`;
const ChatBoxWrapper = styled.div`
  margin-top: 15%;
  height: 80%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  background-color: bisque;
`;
const SendButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 20px;
  margin-left: 10px;
  margin-right: 10px;
  height: 50px;
  width: 70px;
  border-radius: 10px;
  background-color: #53787d;
  color: white;
  font-size: 20px;
  font-family: "Quicksand", sans-serif;
  font-weight: 700;
  &:hover {
    cursor: pointer;
    background-color: #3f696e;
  }
`;
const BackButton = styled(SendButton)`
  background-color: #70b991;
  &:hover {
    background-color: #569b75;
  }
`;

const PostPage = () => {
  const {
    loginId,
    setLoginId,
    userModal,
    posts,
    setPosts,
    account,
    focusedBulletin,
    bulletinName,
    JWT,
    displayStatus,
  } = usePost();
  const navigateBulletin = () => {
    navigate("/");
    setLoginId("");
  };
  const navigate = useNavigate();
  let limit = 20;
  const [plainData, setPlainData] = useState("");
  const [contentData, setContentData] = useState("");
  const msgFooter = useRef(null);
  const fetch = async () => {
    let area = focusedBulletin;
    console.log(focusedBulletin);
    //console.log(area);
    const { data } = await axios.post(
      "/api/bulletinPost",
      {
        area,
        limit,
      },
      { headers: { Authorization: JWT } }
    );
    setPosts(data.info.pinned_post_arr);
    //displayStatus(data);
    console.log(data.info.pinned_post_arr);
  };
  useEffect(() => {
    fetch();
  }, []);
  const sendPost = async () => {
    let area = focusedBulletin; // Need to change to bulletin area number
    const { data } = await axios.post(
      "/api/post",
      {
        account,
        contentData,
        area,
      },
      { headers: { Authorization: JWT } }
    );
    displayStatus(data);
    if (data["status"]) {
      console.log(data);
      setPosts([...posts, data]);
      console.log(bulletinName);
      // console.log(posts);
      setContentData("");
    }
  };

  const postMap = (item) => {
    let content = Parser(item.content);
    return (
      <>
        <div className="eachPostContainer">
          <div className="userWrapper">
            <img
              src={require("../utils/image/image" +
                item.userinfo.image +
                ".png")}
            />
            <span>{item.userinfo.nickname}</span>
          </div>
          <div className="contentContainer">
            <span>{content}</span>
          </div>
        </div>
      </>
    );
  };
  const ImgurUploader = ImgurUploaderInit({ clientID: "9bcae26b4f749ea" });
  return (
    <div className="postPageContainer">
      {/*userModal ? <UserModal /> : <></>*/}

      <DetailModal />

      <div className="post">
        <ChatBoxWrapper>
          {posts.map(
            (item) => postMap(item)
            // <div>--------------------</div>
          )}

          <FootRef ref={msgFooter}></FootRef>
        </ChatBoxWrapper>
      </div>
      <div className="postWrapper">
        <div className="editor">
          {bulletinName}
          <CKEditor
            editor={ClassicEditor}
            data={contentData}
            config={{
              toolbar: [
                "bold",
                "link",
                "|",
                "uploadImage",
                "|",
                "undo",
                "redo",
              ],
              extraPlugins: [ImgurUploader],
            }}
            onReady={(editor) => {
              editor.editing.view.change((writer) => {
                writer.setStyle(
                  "min-width",
                  "180px",
                  editor.editing.view.document.getRoot()
                );
              });
            }}
            onChange={(event, editor) => {
              setContentData(editor.getData());
            }}
          />
        </div>
        <SendButton onClick={sendPost}>
          <SendIcon />
        </SendButton>
      </div>
    </div>
  );
};
export default PostPage;
