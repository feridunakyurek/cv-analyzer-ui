import { Route, Routes } from "react-router";
import "./App.css";
import LogIn from "./pages/LogIn";
import MainPage from "./pages/MainPage";
import Register from "./pages/Register";

function App() {
  return (
    <div className="split-container">
      <aside className="left-side">
        <div className="moon-icon">◐</div>
        <div className="left-content">
          <h1 className="brand">IntelliHire</h1>

          <div className="subtitle">
            <div>Yapay&nbsp;&nbsp;<span>Zeka</span>&nbsp;&nbsp;Destekli&nbsp;CV</div>
            <div>Analizi</div>
          </div>

          <p className="lead">
            AI destekli CV analiz ve sıralama sistemi — adayların özgeçmişlerini
            yapay zekâ ile değerlendirir, pozisyon gereksinimlerine göre en uygun adayları sıralar.
          </p>

          <div className="left-footer">Developed with Spring Boot &amp; React | Powered by OpenAI</div>
        </div>
      </aside>

      <main className="right-side">
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;