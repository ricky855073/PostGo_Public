import React, { useState } from "react";
import styled from "styled-components";
import { Input, Button, Tag, Tabs } from "antd";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { usePost } from "./hooks/usePost";
import "../utils/CSS/userModal.css";
import axios from "../utils/others/api";
const UserModal = () => {
  const navigate = useNavigate();
  const Buttun = styled(Button)`
    background-color: rgba(209, 14, 14, 0.671);
    color: black;
  `;
  const Bottun = styled(Button)`
    background-color: rgb(72, 83, 231, 0.5);
  `;
  const navigateLogOut = () => {
    setUserModal(false);
    navigate("/");
    setNickname("");
    setEmail("");
    logout();
  };
  const changePassword = async () => {
    const { data } = await axios.post(
      "/api/user",
      {
        account,
        oldPassword,
        newPassword,
      },
      { headers: { Authorization: JWT } }
    );
    console.log(data);
    displayStatus(data);
    setNewPwd("");
    setOldPwd("");
  };
  const onClickHandler = () => {
    changePassword();
  };
  const onCancelHandler = () => {
    setNewPwd("");
    setOldPwd("");
  };
  const {
    userModal,
    logout,
    setUserModal,
    setNickname,
    setEmail,
    account,
    JWT,
    displayStatus,
  } = usePost();
  const [pwd, setPwd] = useState(false);
  const [oldPassword, setOldPwd] = useState("");
  const [newPassword, setNewPwd] = useState("");
  return userModal ? (
    <div className="userModalContainer">
      {/* <div className="userModalInner">主要是管</div>
      <div className="userModalInner">帳號</div>
      <div className="userModalInner">密碼</div> */}
      <div className="inputContain">
        <div>
          <div className="pwdinput">
            <Input.Password
              placeholder="舊密碼"
              value={oldPassword}
              onChange={(event) => {
                setOldPwd(event.currentTarget.value);
              }}
            />
          </div>
          <div className="pwdinput">
            <Input.Password
              placeholder="新密碼"
              value={newPassword}
              onChange={(event) => {
                setNewPwd(event.currentTarget.value);
              }}
            />
          </div>
        </div>
        <div className="buttonContain">
          <Bottun onClick={onClickHandler}>確認</Bottun>
          <Button onClick={onCancelHandler}>取消</Button>
        </div>
      </div>
      <div className="buttonContain">
        <div className="but">
          <Buttun
            className="loginButton"
            size="large"
            style={{ width: "100%" }}
            onClick={navigateLogOut}
          >
            登出
          </Buttun>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
export default UserModal;
