import React, { useState } from "react";
import styled from "styled-components";
import { Input, Button, Tag, Tabs } from "antd";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import GoogleMap from "./googleAPI";
import "../utils/CSS/bulletinPage.css";
import DetailModal from "./detailModal";
import PostModal from "./postModal";
import { usePost } from "./hooks/usePost";

const BulletinPage = () => {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [modalPost, setModalPost] = useState(null);
  const { id } = useParams();
  const { account, logout } = usePost();
  const navigate = useNavigate();
  // console.log(account);
  const navigatePost = () => {
    console.log(id);
    navigate("/post/" + id, {});
  };
  const navigateLogOut = () => {
    navigate("/");
    logout();
  };
  return (
    <div className="bulletinPageContainer">
      <DetailModal />

      <div className="googleMapContainer">
        <div className="mapContainer">
          <GoogleMap
            access={true}
            setPostModalOpen={setPostModalOpen}
            setModalPost={setModalPost}
          />
        </div>
      </div>
      <PostModal open={postModalOpen} area={modalPost} id={id} />
    </div>
  );
};
export default BulletinPage;
