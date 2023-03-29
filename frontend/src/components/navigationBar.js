import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import styled from "styled-components";
import { Button } from "antd";
import { usePost } from "../containers/hooks/usePost";
import "../utils/CSS/navigationBar.css";
import "../utils/CSS/toggleButton.css";
import UserModal from "../containers/userModal";
import { Data } from "@react-google-maps/api";
const NavBar = () => {
  const { account, userModal, setUserModal, image, JWT } = usePost();
  const onClickHandler = (event) => {
    console.log(userModal);
    let tmp = userModal;
    setUserModal(!tmp);
  };
  return (
    <div className="navBarContainer">
      {account && JWT ? (
        <>
          <NavLink to={"/bulletin/" + account} className="titleContainer">
            <h1>PostGo</h1>
            {/* <i className="fa-regular fa-map-location-dot"></i> */}
            {/* <img
              id="titleIcon"
              src={require("../utils/image/PostGo.png")}
              alt="title_icon"
            /> */}
          </NavLink>

          <div className="user" onClick={onClickHandler}>
            <img
              id="userIcon"
              src={
                image ? require("../utils/image/image" + image + ".png") : ""
              }
            />
          </div>
          {userModal ? <UserModal /> : <></>}
        </>
      ) : (
        <NavLink to="/" className="titleContainer">
          <h1>PostGo</h1>
        </NavLink>
      )}
    </div>
  );
};
export default NavBar;
