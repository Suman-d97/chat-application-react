
import { createBrowserRouter } from "react-router-dom";
import Chat from "../components/Chat";

import AuthPage from "../pages/AuthPage";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage/>
  },
  {
    path: "/chat",
    element: <Chat/>
  },
    {
    path: "/auth",
    element: <AuthPage />
  },
])
export default Routes