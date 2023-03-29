import React, { useState } from "react";
import styled from "styled-components";
import { Input, Button, Tag, Tabs } from "antd";
import "../utils/CSS/mainPage.css";
import axios from "../utils/others/api";
import { useNavigate, useLocation, useNavigation } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  const navigateLogin = () => {
    axios.get("/api/");
    navigate("/login", {});
  };
  return (
    <>
      <div className="mainPageContainer">
        <Button className="toLoginButton" onClick={navigateLogin} size="large">
          開始
        </Button>
      </div>
    </>
  );
};
export default MainPage;
