// src/pages/MainPage-Favorites.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage-Favorites.css";

function MainPageFavorites() {
  const navigate = useNavigate();

  const favoriteLinks = [
    { id: 1, title: "세상에서 가장 긴 워터슬라이드", desc: "설명설명설명" },
    { id: 2, title: "Chat GPT", desc: "설명설명설명" },
  ];

  return (
    <div className="favorites-container">
      <header className="favorites-header">
        <h1>Linko</h1>
        <div className="right-section">
          <div className="search-bar">
            <input type="text" placeholder="검색" />
            <button className="clear-btn">×</button>
          </div>
          <button
            className="premium-btn"
            onClick={() => navigate("/premium")}
          >
            프리미엄 구독
          </button>
        </div>
      </header>

      <div className="filter-buttons">
        <button onClick={() => navigate("/home")}>전체</button>
        <button className="active">즐겨찾기</button>
      </div>

      <main className="favorites-grid">
        {favoriteLinks.map((link) => (
          <div key={link.id} className="fav-card">
            <div className="img-box">🖼️</div>
            <div className="info">
              <p className="title">{link.title}</p>
              <p className="desc">{link.desc}</p>
            </div>
            <span className="star">★</span>
          </div>
        ))}
        <button
          className="add-btn"
          onClick={() => navigate("/add-link")}
          title="링크 추가"
        >
          ＋
        </button>
      </main>
    </div>
  );
}

export default MainPageFavorites;
