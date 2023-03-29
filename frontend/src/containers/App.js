import MainPage from "./mainPage";
import LoginPage from "./loginPage";
import BulletinPage from "./bulletinPage";
import PostPage from "./postPage";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "../components/navigationBar";
function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/bulletin/:id" element={<BulletinPage />} />
        <Route path="/post/:id" element={<PostPage />} />
      </Routes>
    </Router>
  );
}

export default App;
