import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Companies from "./pages/CompanyDetailed";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/companies/:id" element={<Companies />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
