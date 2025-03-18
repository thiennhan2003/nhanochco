import './App.css';
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from './layout/DefaultLayout';
import Dashboard from './pages/DashBoardPage'; // Sửa import đúng file
import LoginPage from './pages/LoginPage'; // Đảm bảo LoginPage được định nghĩa
import NoPage from './pages/NoPage'; // Đảm bảo NoPage được định nghĩa
import EmptyLayout from './layout/EmptyLayout';
import UsersPage from './pages/UsersPage'; // Đảm bảo UsersPage được định nghĩa
import RestaurantsPage from './pages/RestaurantsPage'; // Đảm bảo RestaurantsPage được định nghĩa

const queryClient = new QueryClient()
function App() {
    return (
        <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DefaultLayout />}>
                    <Route index element={<Dashboard />} /> {/* Sửa DashBoardPage thành Dashboard */}
                    <Route path='users' element={<UsersPage />} />
                    <Route path='restaurants' element={<RestaurantsPage />} />
                </Route>
                <Route path="/login" element={<EmptyLayout />}>
                    <Route index element={<LoginPage />} /> {/* Trang Login */}
                </Route>
                <Route path="*" element={<NoPage />} />
            </Routes>
        </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;