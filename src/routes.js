import {Navigate, Route, Routes} from 'react-router-dom';
// layouts
import {useSelector} from "react-redux";
import DashboardLayout from './layouts/dashboard';
//
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import {RequireAuth} from "./components/private-route/RequireAuth";
import CheckContentPage from "./pages/CheckContentPage";
import PostPage from "./pages/PostPage";

// ----------------------------------------------------------------------

export default function Router() {
    const auth = useSelector(state => state.auth)
  return (
      <Routes>
          <Route path="/login" element={auth.isLogin ? <Navigate to={"/"}/> : <LoginPage />} />
        <Route element={<DashboardLayout />}>
          <Route element={<RequireAuth />}>
              <Route path="/bai-viet" element={<PostPage />} />
              <Route path="/kiem-tra/:id" element={<CheckContentPage />} />
              <Route path="/" element={<DashboardAppPage />} />
          </Route>

        </Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
  )
}
