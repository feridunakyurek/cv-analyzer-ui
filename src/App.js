import { Route, Routes } from "react-router";
import { useTranslation } from "react-i18next";
import "./App.css";
import LogIn from "./pages/LogIn";
import MainPage from "./pages/MainPage";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import LanguageSwitcher from "./components/LanguageSwitcher";

function App() {
  const { t } = useTranslation();

  return (
      <div className="split-container">
        <aside className="left-side">
          <div
            className="top-bar"
            style={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              top: "20px",
              left: "20px",
              zIndex: 10, 
            }}
          >
            <LanguageSwitcher />

          </div>

          <div className="left-content">
            <h1 className="brand">IntelliHire</h1>

            <div className="subtitle">
              <div>
                {t("title_pre")}&nbsp;&nbsp;
                <span>{t("title_highlight")}</span>&nbsp;&nbsp;
                {t("title_post")}
              </div>
              <div>{t("title_sub")}</div>
            </div>

            <p className="lead">{t("lead")}</p>

            <div className="left-footer">
              Developed with Spring Boot &amp; React | Powered by OpenAI
            </div>
          </div>
        </aside>

        <main className="right-side">
          <Routes>
            <Route path="/" element={<LogIn />} />
            <Route
              path="/mainpage"
              element={
                <ProtectedRoute>
                  <MainPage />
                </ProtectedRoute>
              }
            />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;
