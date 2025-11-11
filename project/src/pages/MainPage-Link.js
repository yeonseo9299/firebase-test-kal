// src/pages/MainPage-Link.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./MainPage-Link.css";

function MainPageLink() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // 이미지 미리보기를 위한 에러 핸들러
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/100x100/f0f0f0/888?text=No+Image"; 
  };
  
  // 사용자 메시지를 잠시 표시했다가 사라지게 하는 함수
  const showMessage = (msg, isErr = false) => {
    setMessage(msg);
    setIsError(isErr);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleSave = async () => {
    // 필수 입력 필드 검사
    if (!title || !link) {
      showMessage("제목과 링크 주소를 모두 입력해주세요.", true);
      return;
    }

    // 사용자 인증 상태 확인 (보강)
    if (!auth.currentUser) {
        // ⚠️ Firestore 요청 전에 클라이언트에서 차단합니다.
        showMessage("로그인 상태가 아닙니다. 링크를 저장할 수 없습니다.", true);
        return;
    }

    try {
      const linksCollection = collection(db, "links");
      
      const userId = auth.currentUser.uid;

      await addDoc(linksCollection, {
        title,
        link,
        imageUrl: imageUrl || "",
        favorite: false,
        createdAt: serverTimestamp(),
        // 🔑 보안 규칙을 충족시키기 위해 uid 필드를 저장합니다.
        uid: userId, 
      });

      showMessage("✅ 링크가 성공적으로 저장되었습니다!");
      
      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (error) {
      console.error("링크 저장 오류:", error);
      showMessage("❌ 링크 저장 중 오류가 발생했습니다. 권한 문제일 수 있습니다.", true);
    }
  };

  return (
    <div className="link-add-container">
      <button className="back-btn" onClick={() => navigate("/home")} aria-label="뒤로 가기">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>

      <h2 className="add-page-title">새 링크 추가</h2>

      {message && (
        <div className={`status-message ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="image-preview-box">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="링크 미리보기" 
            className="preview-img"
            onError={handleImageError}
          />
        ) : (
          <div className="no-image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-image">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <p>이미지 미리보기</p>
          </div>
        )}
      </div>

      <div className="input-group">
        <label htmlFor="title">제목</label>
        <input
          id="title"
          type="text"
          className="link-input"
          placeholder="저장할 링크의 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label htmlFor="imageUrl">이미지 링크</label>
        <input
          id="imageUrl"
          type="text"
          className="link-input"
          placeholder="이미지 URL (선택 사항)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="link">링크 주소</label>
        <input
          id="link"
          type="text"
          className="link-input"
          placeholder="링크 주소 (https://...)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      <button className="save-btn" onClick={handleSave}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-save mr-2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        링크 저장하기
      </button>
    </div>
  );
}

export default MainPageLink;