// src/components/pages/SignInPage.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./SignInPage.css";

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 성공!");
      navigate("/home");
    } catch (error) {
      alert("로그인 실패: " + error.message);
    }
  };

  return (
    <div className="signin-container">
      <h2>로그인</h2>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
      </form>
      <p>
        계정이 없으신가요?{" "}
        <span className="link" onClick={() => navigate("/signup")}>
          회원가입
        </span>
      </p>
    </div>
  );
}

export default SignInPage;
