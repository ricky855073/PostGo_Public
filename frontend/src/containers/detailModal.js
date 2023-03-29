import React, { useState } from "react";
import styled from "styled-components";
import { Input, Button, Tag, Tabs } from "antd";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { usePost } from "./hooks/usePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faMap,
  faMapPin,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import "../utils/CSS/detailModal.css";
import "../utils/CSS/menuButton.scss";
import "../utils/CSS/nickName.scss";
import "../utils/CSS/avatar.scss";
// import 'font-awesome/css/font-awesome.min.css';
import SettingModal from "./settingModal";
const DetailModal = () => {
  const [isToggled, toggle] = useState(false);

  const [isAvatarToggled, avatarToggle] = useState(0);
  const { circle, setCircle, located, setLocated, gear, setGear } = usePost();
  const callback = () => {
    toggle(!isToggled);
    // onClick(!isToggled)
  };

  const avatarCallback1 = () => {
    avatarToggle(1);
    console.log("Tog!!");
    // onClick(!isToggled)
  };
  const avatarCallback2 = () => {
    avatarToggle(2);
    console.log("Tog!!");
    // onClick(!isToggled)
  };
  const avatarCallback3 = () => {
    avatarToggle(3);
    console.log("Tog!!");
    // onClick(!isToggled)
  };

  return (
    <div className="detailContainer">
      {/* <h1 className="nickName">暱稱</h1>
      <h1>頭像</h1>
      <h1>成就</h1>
      <h1>徽章</h1>
      <h1>總人氣</h1> */}

      <div className="avatar-wrapper"></div>
      {gear ? <SettingModal /> : <></>}
      <div className={isToggled ? "list-container active" : "list-container"}>
        <button
          className="more-button"
          aria-label="Menu Button"
          onClick={callback}
        >
          <div className="menu-icon-wrapper">
            <div className="menu-icon-line half first"></div>
            <div className="menu-icon-line"></div>
            <div className="menu-icon-line half last"></div>
          </div>
        </button>
        <ul
          className={isToggled ? "more-button-list active" : "more-button-list"}
        >
          <li
            className="more-button-list-item"
            onClick={() => {
              setGear(!gear);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-settings"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            <span>設定</span>
          </li>

          <li
            className="more-button-list-item"
            onClick={() => {
              console.log(located);
              setLocated(!located);
            }}
          >
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-map-pin"
            >
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
            </svg> */}
            <FontAwesomeIcon icon={faLocationDot} />
            <span>定位</span>
          </li>
          <li
            className="more-button-list-item"
            onClick={() => {
              setCircle(!circle);
            }}
          >
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-trash-2"
            >
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
            </svg> */}
            <FontAwesomeIcon icon={faMap} />
            <span>圓圈</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default DetailModal;
