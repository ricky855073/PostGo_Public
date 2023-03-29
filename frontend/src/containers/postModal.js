import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Input, Button, Tag, Tabs } from "antd";
import { useParams } from "react-router-dom";
import Parser from "html-react-parser";
import { useNavigate } from "react-router-dom";
import { usePost } from "./hooks/usePost";
import "../utils/CSS/postModal.css";
import axios from "../utils/others/api";
import "../utils/CSS/post.scss";
const PostModal = ({ open, area, id }) => {
  const navigate = useNavigate();
  const navigatePost = () => {
    console.log(id);
    navigate("/post/" + id, {});
  };
  const { bulletinName, distance, JWT } = usePost();
  const [po, setPo] = useState(null);
  let limit = 1;
  //et data = "";
  useEffect(() => {
    fetchPost();
  }, [area]);
  const fetchPost = async () => {
    if (area) {
      const { data } = await axios.post(
        "/api/bulletinPost",
        {
          area,
          limit,
        },
        { headers: { Authorization: JWT } }
      );
      // console.log(data);
      // console.log(data.info.pinned_post_arr[0][0]);
      setPo(data.info.pinned_post_arr);
    }
  };
  const poMap = (item) => {
    let content = Parser(item.content);
    return (
      <div className="eachPostContainer">
        <div className="userWrapper">
          <img
            src={require("../utils/image/image" + item.userinfo.image + ".png")}
          />
          <span>{item.userinfo.nickname}</span>
        </div>
        <div className="contentContainer">
          {content}
          {/* <img src="https://i.imgur.com/AbEGLuk.jpeg" /> */}
        </div>
      </div>
    );
  };
  return (
    <div className="postContainer">
      <div className="render">
        {" "}
        {open && po ? po.map((item) => poMap(item)) : <></>}
      </div>
      {open && po && distance ? (
        <Button onClick={navigatePost}>進入{bulletinName}</Button>
      ) : (
        <></>
      )}
    </div>
  );
};
export default PostModal;
