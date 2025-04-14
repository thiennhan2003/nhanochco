"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

interface User {
  _id: string
  username: string
  fullname: string
  email: string
  role: string
  active: boolean
  avatar: string
  createdAt: string
  updatedAt: string
}

interface Restaurant {
  _id: string
  name: string
  address: string
  phone: string
  category_id: { category_name: string }
  is_active: boolean
  avatar_url: string
  menu_id: { _id: string; name: string; price: number }[]
  owner_id: { _id: string }
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = localStorage.getItem("userProfile")
        if (!userProfile) {
          throw new Error("Không tìm thấy thông tin người dùng")
        }

        const userData = JSON.parse(userProfile)
        setUser(userData)

        if (userData.role === "restaurant_owner") {
          fetchUserRestaurants(userData._id)
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const fetchUserRestaurants = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/restaurants`)
      const data = await response.json()
      const userRestaurants = data.restaurants.filter((restaurant: Restaurant) => restaurant.owner_id._id === userId)
      setRestaurants(userRestaurants)
    } catch (error) {
      console.error("Error fetching restaurants:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-rose-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-rose-600 font-medium text-lg">
            <p>Không thể tải thông tin người dùng</p>
            <Link
              to="/login"
              className="mt-4 inline-block px-6 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
            >
              Đăng nhập lại
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-md overflow-hidden mb-10">
          {/* Banner with gradient overlay */}
          <div className="h-40 sm:h-56 bg-gradient-to-r from-rose-300 to-rose-300 relative">
            <div className="absolute inset-0 backdrop-blur-sm"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/10 to-transparent"></div>
          </div>
          
          <div className="px-5 sm:px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-16 sm:-mt-24 mb-6">
              {/* Avatar with animated hover effect */}
              <div className="relative z-10 mx-auto sm:mx-0">
                <div className="h-32 w-32 sm:h-44 sm:w-44 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white relative group">
                  <div className="absolute inset-0 bg-gradient-to-b group-hover:opacity-0 transition-opacity duration-300 z-10"></div>
                  <img
                    src={user.avatar || "https://via.placeholder.com/160"}
                    alt={user.fullname}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                {/* Status badge positioned on avatar */}
                <div className="absolute bottom-3 -right-6">
                  {user.active ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                      Không hoạt động
                    </span>
                  )}
                </div>
              </div>
              
              {/* User info */}
              <div className="mt-6 sm:mt-0 sm:ml-8 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-2xl font-bold text-gray-900 mt-24">{user.fullname}</h1>
                <p className="text-gray-500 mb-2">@{user.username}</p>
                <p className="inline-block bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">
                  {user.role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
              </div>
            </div>

            {/* User Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Thông Tin Cá Nhân
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-white rounded-xl">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-xl">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Vai trò</p>
                      <p className="font-medium text-gray-900">
                        {user.role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information Card */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  Thông Tin Tài Khoản
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-white rounded-xl">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Ngày tạo tài khoản</p>
                      <p className="font-medium text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-xl">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Cập nhật gần nhất</p>
                      <p className="font-medium text-gray-900">
                        {new Date(user.updatedAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurants Section */}
        {user.role === "restaurant_owner" && (
          <div className="bg-white rounded-3xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white">Nhà Hàng Của Tôi</h2>
                <Link
                  to="/add-restaurant"
                  className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm nhà hàng
                </Link>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {restaurants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map((restaurant) => (
                    <div
                      key={restaurant._id}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="aspect-video relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
                        <img
                          src={restaurant.avatar_url || "https://via.placeholder.com/400x200"}
                          alt={restaurant.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 w-full p-4 text-white z-20">
                          <h3 className="text-xl font-bold mb-1 drop-shadow-md">{restaurant.name}</h3>
                          <div className="flex items-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                restaurant.is_active ? "bg-green-500 text-white" : "bg-red-500 text-white"
                              }`}
                            >
                              {restaurant.is_active ? "Đang hoạt động" : "Đã đóng cửa"}
                            </span>
                            <span className="text-xs ml-2 opacity-90">{restaurant.category_id.category_name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="space-y-3 mb-4">
                          <div className="flex items-start">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <p className="text-sm text-gray-600">{restaurant.address}</p>
                          </div>
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <p className="text-sm text-gray-600">{restaurant.phone}</p>
                          </div>
                        </div>

                        {/* Menu Preview */}
                        {restaurant.menu_id.length > 0 && (
                          <div className="bg-gray-50 rounded-xl p-3 mt-3">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1 text-rose-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                              Menu nổi bật
                            </h4>
                            <div className="space-y-2">
                              {restaurant.menu_id.slice(0, 3).map((menuItem) => (
                                <div key={menuItem._id} className="flex justify-between items-center bg-white p-2 rounded-lg">
                                  <span className="text-xs text-gray-600 truncate">{menuItem.name}</span>
                                  <span className="text-xs font-medium text-rose-600 ml-2">
                                    {menuItem.price.toLocaleString("vi-VN")} ₫
                                  </span>
                                </div>
                              ))}
                              {restaurant.menu_id.length > 3 && (
                                <div className="text-xs text-center text-gray-500 italic pt-1">
                                  +{restaurant.menu_id.length - 3} món khác
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                          <Link
                            to={`/restaurants/${restaurant._id}`}
                            className="text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center"
                          >
                            Xem chi tiết
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ml-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                          <Link
                            to={`/edit-restaurant/${restaurant._id}`}
                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Quản lý
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center shadow-inner">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-rose-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-3">Chưa có nhà hàng nào</h3>
                    <p className="text-gray-600 mb-8">Bạn chưa thêm nhà hàng nào vào tài khoản của mình</p>
                    <Link
                      to="/add-restaurant"
                      className="inline-flex items-center px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Thêm nhà hàng mới
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile