import React, { useState } from "react";
import styled from "styled-components";
import { Input, Button, Tag, Tabs } from "antd";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import GoogleMap from "./googleAPI";
import "../utils/CSS/settingModal.css";
import DetailModal from "./detailModal";
import PostModal from "./postModal";
import axios from "../utils/others/api";
import { usePost } from "./hooks/usePost";
const Buttun = styled(Button)`
  background-color: rgb(72, 83, 231, 0.5);
`;

const SettingModal = () => {
  const {
    nickname,
    setNickname,
    setGear,
    image,
    setImage,
    JWT,
    account,
    displayStatus,
  } = usePost();
  const [modNickname, setModNickname] = useState(nickname);
  const [index, setIndex] = useState(image);

  const callback1 = () => {
    setIndex(1);
  };

  const callback2 = () => {
    setIndex(2);
  };

  const callback3 = () => {
    setIndex(3);
  };

  const onClickHandler = async () => {
    const { data } = await axios.patch(
      "/api/user",
      {
        account,
        modNickname,
        index,
      },
      { headers: { Authorization: JWT } }
    );
    displayStatus(data);
    setNickname(modNickname);
    setImage(index);
    setGear(false);
  };
  const onCancelHandler = () => {
    setGear(false);
  };
  console.log(nickname);
  return (
    <div className="settingContainer">
      <div>
        暱稱
        <Input
          placeholder="暱稱"
          value={modNickname}
          onChange={(event) => {
            setModNickname(event.currentTarget.value);
          }}
        />
      </div>
      <div>
        頭像
        <div className="imageWrapper">
          <div className="user1">
            <img
              id="userIcon1"
              src={require("../utils/image/image1.png")}
              onClick={callback1}
              style={{
                transform: index == 1 ? "scale(140%)" : "none",
              }}
            />
          </div>
          <div className="user1">
            <img
              id="userIcon1"
              src={require("../utils/image/image2.png")}
              onClick={callback2}
              style={{
                transform: index == 2 ? "scale(140%)" : "none",
              }}
            />
          </div>
          <div className="user1">
            <img
              id="userIcon1"
              src={require("../utils/image/image3.png")}
              onClick={callback3}
              style={{
                transform: index == 3 ? "scale(140%)" : "none",
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <Buttun onClick={onClickHandler}>確認</Buttun>
        <Button onClick={onCancelHandler}>取消</Button>
      </div>
    </div>
  );
};
export default SettingModal;
