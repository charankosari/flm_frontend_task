import { GiHamburgerMenu } from "react-icons/gi";
import { IoBagOutline } from "react-icons/io5";

function Sidebar({ isOpen, onToggleSidebar }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <button className="menu-toggle-btn" onClick={onToggleSidebar}>
          <GiHamburgerMenu size={26} />
        </button>
        <span className="logo-text">FLM</span>
      </div>
      <nav>
        <ul>
          <li className="active">
            <IoBagOutline size={26} />
            <span className="link-text">Companies</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
