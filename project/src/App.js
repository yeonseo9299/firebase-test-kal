import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import MainPage from './pages/MainPage';
import MainPageLink from './pages/MainPage-Link';
import MainPageFavorites from './pages/MainPage-Favorites';
import MainPagePrimer from './pages/MainPage-Primer';

/*
1. 페이지 단위 기획
2. 각 페이지에 들어갈 컴포넌트 기획

로그인 페이지
- 로그인 기능을 하는 컴포넌트
=> 아이디 입력, 비밀번호 입력, 로그인 버튼, 회원가입 버튼

회원가입 페이지
- 이메일(아이디) 입력, 비밀번호 입력, 비밀번호 확인 입력, 
닉네임 입력, 추가사항(연락처, 성별, 생년월일) 입력, 약관

렌딩 페이지 (Landing)
- 브랜드(서비스)에 대한 설명을 적어놓은 페이지
- 로그인으로 이동하거나 혹은 회원가입으로 이동할 수 있어야 함
- 보통 컴포넌트 2~3개 생성

메인 페이지
- 서비스에 대한 페이지
- 서비스에 관련된 추가적 페이지가 존재
- 서비스에 관련된 추가적인 컴포넌트가 존재
*/

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 기본 페이지 */}
                <Route path='/' element={<LandingPage />} />

                {/* 인증 관련 */}
                <Route path='/signin' element={<SignInPage />} />
                <Route path='/signup' element={<SignUpPage />} />

                {/* 메인 서비스 페이지 */}
                <Route path='/home' element={<MainPage />} />

                {/* MainPage 관련 하위 페이지 */}
                <Route path='/add-link' element={<MainPageLink />} />
                <Route path='/favorites' element={<MainPageFavorites />} />
                <Route path='/premium' element={<MainPagePrimer />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
