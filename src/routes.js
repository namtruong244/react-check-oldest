import {Navigate, Route, Routes} from 'react-router-dom';
// layouts
import {useSelector} from "react-redux";
import DashboardLayout from './layouts/dashboard';

import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import {RequireAuth} from "./components/private-route/RequireAuth";
import CheckContentPage from "./pages/CheckContentPage";
import PostPage from "./pages/PostPage";
import WelcomePage from "./pages/WelcomePage";
import StatisticPage from "./pages/StatisticPage";

// ----------------------------------------------------------------------

export default function Router() {
    const auth = useSelector(state => state.auth)
    return (
        <Routes>
            <Route path="/login" element={auth.isLogin ? <Navigate to={"/chao-mung"}/> : <LoginPage/>}/>
            <Route element={<RequireAuth/>}>
                <Route path="/chao-mung" element={<WelcomePage/>}/>
            </Route>
            <Route element={<DashboardLayout/>}>
                <Route element={<RequireAuth/>}>
                    <Route path="/tao-bai-viet" element={<PostPage/>}/>
                    <Route path="/kiem-tra/:id" element={<CheckContentPage/>}/>
                    <Route path="/bai-viet" element={<DashboardAppPage/>}/>
                    <Route path="/thong-ke" element={<StatisticPage/>}/>
                    <Route path="/" element={<Navigate to="chao-mung"/>} />
                </Route>
            </Route>
            <Route path="*" element={<Page404/>}/>
        </Routes>
    )
}
