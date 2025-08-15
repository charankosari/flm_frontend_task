import CompaniesList from "./CompaniesList";
import { FaUser } from "react-icons/fa";

function MainContent() {
  return (
    <main className="main-content">
      <header className="main-header">
        <div className="user-profile-icon">
          <FaUser size={24} />
        </div>
      </header>
      <div className="content-body">
        <CompaniesList />
      </div>
    </main>
  );
}

export default MainContent;
