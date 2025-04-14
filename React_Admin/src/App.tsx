import './App.css';
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from './layout/DefaultLayout';
import Dashboard from './pages/DashBoardPage'; // Sửa import đúng file
import LoginPage from './pages/LoginPage'; // Đảm bảo LoginPage được định nghĩa
import NoPage from './pages/NoPage'; // Đảm bảo NoPage được định nghĩa
import EmptyLayout from './layout/EmptyLayout';
import UsersPage from './pages/UsersPage'; // Đảm bảo UsersPage được định nghĩa
import RestaurantPage from './pages/RestaurantPage'; // Add this import
import MenuItemsPage from './pages/Menu_itemPage' // Add this import
import CategoryRestaurantPage from './pages/CategoryRestaurantPage';
import CategoryMenuItemPage from './pages/CategoryMenuItemPage';
import PostsPage from './pages/PostsPage'; // Add this import

const queryClient = new QueryClient()
function App() {
    return (
        <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DefaultLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path='users' element={<UsersPage />} />
                    <Route path='restaurants' element={<RestaurantPage />} />
                    <Route path='menu_items' element={<MenuItemsPage />} />
                    <Route path='posts' element={<PostsPage />} />
                    <Route path='category_restaurants' element={<CategoryRestaurantPage />} />
                    <Route path='category_menu_items' element={<CategoryMenuItemPage />} />

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
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