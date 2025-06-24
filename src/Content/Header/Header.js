import { Search } from "lucide-react"
import "./Header.css"

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header header-gradient text-white shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Quản lý ChefMate</h1>
        </div>
      </div>
    </header>
  )
}

export default Header

