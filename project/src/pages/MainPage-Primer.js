// src/pages/MainPage-Primer.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage-Primer.css";

function MainPagePrimer() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // ✅ 모달 상태

  const handleSubscribeClick = () => {
    setShowModal(true);
  };

  return (
    <div className="premium-container">
      <button className="back-btn" onClick={() => navigate("/home")}>←</button>
      <h2>프리미엄 안내</h2>

      <div className="plan-cards">
        <div className="plan-card">
          <h3>1개월 무료</h3>
          <p>₩0</p>
          <p>기본 링크 5개</p>
          <p>즐겨찾기 기능</p>
          <button onClick={handleSubscribeClick}>구독</button>
        </div>

        <div className="plan-card highlight">
          <h3>1개월 구독</h3>
          <p>₩5,000</p>
          <p>링크 무제한</p>
          <p>AI 추천 기능</p>
          <button onClick={handleSubscribeClick}>구독</button>
        </div>

        <div className="plan-card">
          <h3>1년 구독</h3>
          <p>₩50,000</p>
          <p>모든 기능 무제한</p>
          <p>우선 지원</p>
          <button onClick={handleSubscribeClick}>구독</button>
        </div>
      </div>

      {/* ✅ 애니메이션 포함 모달 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫힘 방지
          >
            <h3>안내</h3>
            <p>해당 기능은 추후 업데이트될 예정입니다.</p>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPagePrimer;
