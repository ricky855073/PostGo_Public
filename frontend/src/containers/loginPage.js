import React, { useState } from "react";
import styled from "styled-components";
import { Input, Button, Tag, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import { usePost } from "./hooks/usePost";
import "../utils/CSS/loginPage.css";
import UserModal from "./userModal";
import axios from "../utils/others/api";
const LoginPage = () => {
  const {
    account,
    setAccount,
    userModal,
    setImage,
    nickname,
    setNickname,
    email,
    setEmail,
    setJWT,
    displayStatus,
  } = usePost();
  const [userAccount, setUserAccount] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [before, setBefore] = useState(false);
  const navigate = useNavigate();
  const navigateBulletin = (id) => {
    if (id) navigate("/bulletin/" + id, {});
  };
  const onClickHandler = async (event) => {
    setAccount(userAccount);
    const { data } = await axios.post("/api/login", {
      userAccount,
      userPassword,
    });
    // console.log(data);
    // console.log(data.info);
    displayStatus(data);
    if (data["status"]) {
      setNickname(data.info.nickname);
      setImage(data.info.image);
      navigateBulletin(userAccount);
      // console.log(data);
      setJWT(data.token);
    }
    // console.log("setAccount", userAccount);
  };
  const onSignupHandler = async (event) => {
    console.log(userAccount, userPassword);
    const { data } = await axios.post("/api/signUp", {
      userAccount,
      userPassword,
      email,
      nickname,
    });
    console.log(data);
    displayStatus(data);
  };
  const onChangeHandler = (event) => {
    setUserAccount(event.currentTarget.value);
  };
  const pwdChangeHandler = (event) => {
    setUserPassword(event.currentTarget.value);
  };
  return (
    <div className="loginPageContainer">
      <div className="LoginWrapper">
        <div>
          <h1 className="login">Login</h1>
        </div>
        <div className="InputWrapper">
          <div className="loginInputs">
            <Input
              size="large"
              style={{ width: "50%" }}
              placeholder="帳號"
              value={userAccount}
              onChange={onChangeHandler}
            />
          </div>
          <div className="loginInputs">
            <Input.Password
              size="large"
              style={{ width: "50%" }}
              placeholder="密碼"
              value={userPassword}
              onChange={pwdChangeHandler}
            />
          </div>
          <div className="loginInputs">
            {before ? (
              <Input
                size="large"
                style={{ width: "50%" }}
                placeholder="信箱"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="loginInputs">
            {before ? (
              <Input
                size="large"
                style={{ width: "50%" }}
                placeholder="暱稱"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div
          onClick={() => {
            setBefore(!before);
          }}
          style={{ cursor: "pointer" }}
        >
          {!before ? "沒有帳號?" : "已有帳號"}
        </div>
        <div className="loginButtonContainer">
          <Button
            className="loginButton"
            onClick={!before ? onClickHandler : onSignupHandler}
            size="large"
          >
            {!before ? "登入" : "註冊"}
          </Button>
          {/* <Button
            className="loginButton"
            onClick={onSignupHandler}
            size="large"
          >
            註冊
          </Button> */}
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
