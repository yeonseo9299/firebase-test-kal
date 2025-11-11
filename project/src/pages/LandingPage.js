// LandingPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h2 className="header-logo">Linko 🔗</h2>
        <div>
          <button className="login-btn" onClick={() => navigate("/signin")}>
            로그인
          </button>
          <button className="signup-btn" onClick={() => navigate("/signup")}>
            회원가입
          </button>
        </div>
      </header>

      <main className="landing-main">
        <h1>
  모든 링크, 한 곳에서<br />
          Linko로 정리하세요
        </h1>
        <p>
          북마크의 복잡함은 잊고, 필요한 정보를 쉽고 빠르게 관리하고 공유할 수 있는<br className="desktop-break" />
          새로운 차원의 링크 관리 경험을 시작하세요.
        </p>
        <button className="start-btn" onClick={() => navigate("/signup")}>
          Linko 시작하기
        </button>
      </main>
    </div>
  );
}

export default LandingPage;
