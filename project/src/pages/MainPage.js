// src/pages/MainPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  where, // where 함수 import
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth"; // onAuthStateChanged import 추가
import "./MainPage.css";

function MainPage() {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 🔑 인증 상태를 추적할 새로운 state 추가
  const [userUid, setUserUid] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // 인증 상태 확인 완료 여부

  // 1. Firebase 인증 상태 변화 감지 및 UID 업데이트
  // 이 로직은 컴포넌트 마운트 시 한 번 실행되어, 인증 상태가 확정될 때까지 기다립니다.
  useEffect(() => {
    // onAuthStateChanged를 사용하여 인증 상태 변화를 실시간으로 추적
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 로그인 상태
        setUserUid(user.uid);
      } else {
        // 로그아웃 상태
        setUserUid(null);
      }
      // 인증 상태 확인이 완료됨을 표시
      setIsAuthReady(true); 
    });

    // 컴포넌트 언마운트 시 Auth 리스너 정리
    return () => unsubscribeAuth();
  }, []); 

  // 2. 인증 상태가 준비되고 userUid가 있을 때만 Firestore 리스너 설정
  useEffect(() => {
    // 인증 상태가 준비되지 않았거나 (초기 로딩 중), 로그인되지 않은 경우 (null)
    if (!isAuthReady || !userUid) {
        if (isAuthReady && !userUid) {
             console.warn("로그인 정보가 없어 Firestore 리스너를 설정하지 않습니다.");
        }
        setLinks([]);
        return; 
    }
    
    // 🔑 userUid가 확정된 후 (로그인 완료 후) 쿼리를 실행
    // 보안 규칙을 통과하기 위해 where('uid', '==', userUid) 조건을 반드시 포함
    const q = query(
      collection(db, "links"),
      where("uid", "==", userUid), // ⬅️ 필터링 추가 (Permission Denied 해결)
      orderBy("createdAt", "desc")
    );
    
    // Firestore 리스너 설정
    const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const linkData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLinks(linkData);
    }, (error) => {
        console.error("❌ Firestore 리스너 오류 (규칙 문제 가능성):", error); 
    });
    
    // userUid가 변경될 때 (로그인/로그아웃)마다 Firestore 리스너 정리 및 재설정
    return () => unsubscribeFirestore();
  }, [isAuthReady, userUid]); 


  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };
  
  // 링크 클릭 시 새 탭으로 열기
  const handleOpenLink = (url) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // 즐겨찾기 토글
  const toggleFavorite = async (id, currentValue) => {
    try {
      // userUid를 사용하여 로그인 상태 확인
      if (!userUid) {
        alert("로그인 정보가 없습니다.");
        return;
      }
      await updateDoc(doc(db, "links", id), { favorite: !currentValue });
    } catch (error) {
      console.error("즐겨찾기 오류:", error);
    }
  };

  // 삭제 모달 열기
  const confirmDelete = (link) => {
    setDeleteTarget(link);
    setShowModal(true);
  };

  // 실제 삭제
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      // userUid를 사용하여 로그인 상태 확인
      if (!userUid) {
        alert("로그인 정보가 없습니다.");
        return;
      }
      await deleteDoc(doc(db, "links", deleteTarget.id));
      setShowModal(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("삭제 오류:", error);
    }
  };

  // 즐겨찾기 및 검색 필터 (links state는 이미 필터링된 데이터만 포함)
  const filteredLinks = links.filter((link) => {
    const matchSearch =
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.link.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFavorite = showFavorites ? link.favorite : true;
    
    // Firestore 쿼리에서 이미 필터링을 했으므로, 클라이언트에서는 검색/즐겨찾기만 필터링
    return matchSearch && matchFavorite; 
  });

  // 로딩 상태 처리
  if (!isAuthReady) {
    return (
        <div className="main-container loading-state-container">
            <h1 className="main-logo">Linko</h1>
            <div className="loading-state">인증 상태 확인 중...</div>
        </div>
    );
  }

  // 로그인되지 않은 경우 (isAuthReady=true, userUid=null)
  if (!userUid) {
    return (
        <div className="main-container auth-needed-container">
            <h1 className="main-logo">Linko</h1>
            <p className="auth-needed-message">
                로그인이 필요합니다.<br/>
                <button className="login-prompt-btn" onClick={() => navigate("/signin")}>
                    로그인 페이지로 이동
                </button>
            </p>
        </div>
    );
  }


  return (
    <div className="main-container">
      <header className="main-header">
        <h1 className="main-logo">Linko</h1>
        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="search-clear"
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            )}
          </div>
          <button className="premium-btn" onClick={() => navigate("/premium")}>
            프리미엄 구독
          </button>
          <button className="logout-btn" onClick={handleLogout} title="로그아웃">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logout-icon">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            로그아웃
          </button>
        </div>
      </header>

      <div className="filter-buttons">
        <button
          className={`filter ${!showFavorites ? "active" : ""}`}
          onClick={() => setShowFavorites(false)}
        >
          전체
        </button>
        <button
          className={`filter ${showFavorites ? "active" : ""}`}
          onClick={() => setShowFavorites(true)}
        >
          즐겨찾기
        </button>
      </div>

      <main className="link-grid">
        {filteredLinks.length === 0 ? (
          <p className="no-result">표시할 링크가 없습니다 😢</p>
        ) : (
          filteredLinks.map((link) => (
            <div key={link.id} className="link-card">
              <button
                className={`star-fixed ${link.favorite ? "active" : ""}`}
                onClick={() => toggleFavorite(link.id, link.favorite)}
              >
                ★
              </button>

              <div className="img-box" onClick={() => handleOpenLink(link.link)}>
                {link.imageUrl ? (
                  <img
                    src={link.imageUrl}
                    alt={link.title}
                    className="link-image"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <span className="no-image">🖼️</span>
                )}
              </div>

              <div
                className="link-info"
                onClick={() => handleOpenLink(link.link)}
              >
                <p className="link-title">{link.title}</p>
                <p className="link-desc">{link.link}</p>
              </div>

              <div className="card-actions">
                <button
                  className="delete-btn"
                  onClick={() => confirmDelete(link)}
                  title="삭제"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}

        <button
          className="add-btn"
          onClick={() => navigate("/add-link")}
          title="링크 추가"
        >
          ＋
        </button>
      </main>

      {/* 삭제 확인 모달 */}
      {showModal && deleteTarget && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>삭제 확인</h3>
            <p>“{deleteTarget.title}” 링크를 삭제하시겠습니까?</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                취소
              </button>
              <button className="confirm-btn" onClick={handleDelete}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;