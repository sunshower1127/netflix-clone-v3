import netflixLogo from "@/assets/netflix-logo.jpg";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div>
      <header>
        <img src={netflixLogo} alt="LOGO" />
      </header>
      {<Outlet />}
      <footer>
        <div className="mt-50">
          made by <i>sunshower1127@github.com</i>
        </div>
      </footer>
    </div>
  );
}
