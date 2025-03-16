import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from './layout/DefaultLayout';
import Dashboard from './pages/DashBoardPage'; // Sửa import đúng file
import LoginPage from './pages/LoginPage'; // Đảm bảo LoginPage được định nghĩa
import NoPage from './pages/NoPage'; // Đảm bảo NoPage được định nghĩa
import EmptyLayout from './layout/EmptyLayout';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DefaultLayout />}>
                    <Route index element={<Dashboard />} /> {/* Sửa DashBoardPage thành Dashboard */}
                </Route>
                <Route path="/login" element={<EmptyLayout />}>
                    <Route index element={<LoginPage />} /> {/* Trang Login */}
                </Route>
                <Route path="*" element={<NoPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;