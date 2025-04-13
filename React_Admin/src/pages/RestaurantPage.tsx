"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosClientPublic } from "../libs/axiosClient"
import { useSearchParams } from "react-router"
import type { AxiosError } from "axios"
import {
  StarIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  XIcon as ExclamationIcon,
  ImageIcon as PhotographIcon,
} from "lucide-react"

// Types
interface CategoryType {
  _id: string
  category_name: string
  description: string
  createdAt: string
  updatedAt: string
}

interface OwnerType {
  _id: string
  username: string
  fullname: string
  email: string
  avatar: string
  active: boolean
  role: string
  createdAt: string
  updatedAt: string
}

interface CommentType {
  _id: string
  user_id: string
  content: string
  rating: number
  createdAt: string
  updatedAt: string
}

interface RestaurantType {
  _id: string
  owner_id: OwnerType
  menu_id: string[]
  name: string
  address: string
  phone: string
  description: string
  category_id: CategoryType
  average_rating: number
  avatar_url: string
  images: string[]
  comments: CommentType[]
  is_active: boolean
  createdAt: string
  updatedAt: string
}

interface RestaurantResponse {
  statusCode: number
  message: string
  data: RestaurantType
}

interface RestaurantFormData {
  id?: string
  name: string
  address: string
  phone: string
  description?: string
  category_id: string
  owner_id: string
  average_rating?: number
  avatar_url?: string
  images?: string[]
  is_active: boolean
}

interface ToggleActiveData {
  id: string
  is_active: boolean
}

export default function RestaurantsPage() {
  const [searchParams] = useSearchParams()
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  // State
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string>("")
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [toast, setToast] = useState<{
    show: boolean
    message: string
    type: "success" | "error"
  }>({
    show: false,
    message: "",
    type: "success",
  })

  // Form state
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: "",
    address: "",
    phone: "",
    description: "",
    category_id: "",
    owner_id: "",
    average_rating: 0,
    avatar_url: "https://via.placeholder.com/150",
    images: [],
    is_active: true,
  })

  const KEYs = {
    getRestaurants: () => ["restaurants", page, limit] as const,
    getRestaurant: (id: string) => ["restaurant", id] as const,
    getOwners: () => ["owners"] as const,
    getCategories: () => ["categories"] as const,
  }

  const queryClient = useQueryClient()

  // Fetch restaurants
  const fetchRestaurants = async (): Promise<RestaurantType[]> => {
    const response = await axiosClientPublic.get(`/restaurants?page=${page}&limit=${limit}`)
    return response.data.restaurants
  }

  const queryRestaurants = useQuery({
    queryKey: KEYs.getRestaurants(),
    queryFn: fetchRestaurants,
  })

  // Fetch owners
  const fetchOwners = async (): Promise<OwnerType[]> => {
    const response = await axiosClientPublic.get("/users?role=restaurant_owner")
    return response.data.data.users
  }

  const queryOwners = useQuery({
    queryKey: KEYs.getOwners(),
    queryFn: fetchOwners,
  })

  // Fetch all categories
  const fetchCategories = async (): Promise<CategoryType[]> => {
    const response = await axiosClientPublic.get("/categoryRestaurant")
    return response.data.data.categoryRestaurants
  }

  const queryCategories = useQuery({
    queryKey: KEYs.getCategories(),
    queryFn: fetchCategories,
  })

  // Delete restaurant
  const deleteRestaurant = async (id: string): Promise<void> => {
    await axiosClientPublic.delete(`/restaurants/${id}`)
  }

  const mutationDelete = useMutation({
    mutationFn: deleteRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYs.getRestaurants() })
      showToast("Xóa nhà hàng thành công!", "success")
      setIsDeleteModalOpen(false)
    },
    onError: (error: AxiosError) => {
      showToast(`Lỗi khi xóa nhà hàng: ${error.response?.data || "Lỗi không xác định"}`, "error")
    },
  })

  // Update restaurant
  const updateRestaurant = async (formData: RestaurantFormData): Promise<RestaurantType> => {
    const { id, ...payload } = formData
    const response = await axiosClientPublic.put(`/restaurants/${id}`, {
      ...payload,
      avatar_url: payload.avatar_url || "https://via.placeholder.com/150",
      images: payload.images || [],
    })
    return response.data
  }

  const mutationUpdate = useMutation({
    mutationFn: updateRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYs.getRestaurants() })
      queryClient.invalidateQueries({ queryKey: KEYs.getRestaurant(selectedId) })
      showToast("Cập nhật nhà hàng thành công!", "success")
      setIsModalEditOpen(false)
      resetForm()
    },
    onError: (error: AxiosError) => {
      showToast(`Lỗi khi cập nhật nhà hàng: ${error.response?.data || "Lỗi không xác định"}`, "error")
    },
  })

  // Toggle active status
  const toggleRestaurantActive = async (data: ToggleActiveData): Promise<void> => {
    const { id, is_active } = data
    await axiosClientPublic.patch(`/restaurants/${id}/toggle-active`, { is_active })
  }

  const mutationToggleActive = useMutation({
    mutationFn: toggleRestaurantActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYs.getRestaurants() })
      showToast("Cập nhật trạng thái nhà hàng thành công!", "success")
    },
    onError: (error: AxiosError) => {
      showToast(`Lỗi khi cập nhật trạng thái: ${error.response?.data || "Lỗi không xác định"}`, "error")
    },
  })

  // Add restaurant
  const addRestaurant = async (formData: Omit<RestaurantFormData, "id">): Promise<RestaurantType> => {
    const response = await axiosClientPublic.post("/restaurants", {
      ...formData,
      avatar_url: formData.avatar_url || "https://via.placeholder.com/150",
      images: formData.images || [],
    })
    return response.data
  }

  const mutationAdd = useMutation({
    mutationFn: addRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYs.getRestaurants() })
      showToast("Thêm nhà hàng thành công!", "success")
      setIsModalAddOpen(false)
      resetForm()
    },
    onError: (error: AxiosError) => {
      showToast(`Lỗi khi thêm nhà hàng: ${error.response?.data || "Lỗi không xác định"}`, "error")
    },
  })

  // Fetch single restaurant for editing
  const fetchRestaurant = async (): Promise<RestaurantResponse> => {
    const response = await axiosClientPublic.get(`/restaurants/${selectedId}`)
    return response.data
  }

  const queryRestaurant = useQuery({
    queryKey: KEYs.getRestaurant(selectedId),
    queryFn: fetchRestaurant,
    enabled: selectedId !== "" && isModalEditOpen,
  })

  // Populate form fields
  const populateFormFields = (restaurantResponse: RestaurantResponse) => {
    const restaurantData = restaurantResponse.data
    setFormData({
      name: restaurantData.name,
      address: restaurantData.address,
      phone: restaurantData.phone,
      description: restaurantData.description,
      category_id: restaurantData.category_id?._id,
      owner_id: restaurantData.owner_id?._id,
      average_rating: restaurantData.average_rating,
      avatar_url: restaurantData.avatar_url,
      images: restaurantData.images,
      is_active: restaurantData.is_active,
    })
  }

  useEffect(() => {
    if (queryRestaurant.isSuccess && queryRestaurant.data) {
      populateFormFields(queryRestaurant.data)
    }
  }, [selectedId, queryRestaurant.data, queryRestaurant.isSuccess])

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      description: "",
      category_id: "",
      owner_id: "",
      average_rating: 0,
      avatar_url: "https://via.placeholder.com/150",
      images: [],
      is_active: true,
    })
  }

  // Handle form submission
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault()
    mutationUpdate.mutateAsync({ id: selectedId, ...formData })
  }

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault()
    mutationAdd.mutateAsync(formData)
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }))
  }

  const handleImagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const imagesArray = e.target.value.split("\n").filter(Boolean)
    setFormData((prev) => ({ ...prev, images: imagesArray }))
  }

  // Toast
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000)
  }

  // Filter restaurants by search term
  const filteredRestaurants = queryRestaurants.data?.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.phone.includes(searchTerm),
  )

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Render stars for rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            toast.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <div className="flex items-center">
            <span>{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-4">
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý nhà hàng</h1>
          <p className="text-gray-500">Quản lý danh sách nhà hàng trong hệ thống</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tìm kiếm nhà hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  viewMode === "table" ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Bảng
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  viewMode === "grid" ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Lưới
              </button>
              <button
                onClick={() => setIsModalAddOpen(true)}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Thêm nhà hàng
              </button>
            </div>
          </div>

          {/* Loading state */}
          {queryRestaurants.isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Đang tải danh sách nhà hàng...</p>
            </div>
          ) : queryRestaurants.isError ? (
            <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
              <ExclamationIcon className="h-6 w-6 mx-auto mb-2" />
              <p>Lỗi khi tải nhà hàng: {queryRestaurants.error?.message || "Lỗi không xác định"}.</p>
              <p>Vui lòng thử lại sau.</p>
            </div>
          ) : (
            <>
              {viewMode === "table" ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Nhà hàng
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Danh mục
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Chủ sở hữu
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Đánh giá
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Trạng thái
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Ngày tạo
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRestaurants && filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map((restaurant) => (
                          <tr key={restaurant._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-md object-cover"
                                    src={restaurant.avatar_url || "https://via.placeholder.com/150"}
                                    alt={restaurant.name}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                                  <div className="text-sm text-gray-500">{restaurant.address}</div>
                                  <div className="text-sm text-gray-500">{restaurant.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {restaurant.category_id?.category_name || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {restaurant.owner_id?.username || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderStars(restaurant.average_rating || 0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <button
                                  onClick={() =>
                                    mutationToggleActive.mutate({
                                      id: restaurant._id,
                                      is_active: !restaurant.is_active,
                                    })
                                  }
                                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    restaurant.is_active ? "bg-green-500" : "bg-gray-200"
                                  }`}
                                >
                                  <span
                                    className={`${
                                      restaurant.is_active ? "translate-x-5" : "translate-x-0"
                                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                  />
                                </button>
                                <span className="ml-2 text-sm text-gray-500">
                                  {restaurant.is_active ? "Hoạt động" : "Không hoạt động"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(restaurant.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                {restaurant.images && restaurant.images.length > 0 && (
                                  <button
                                    onClick={() => {
                                      setSelectedImages(restaurant.images)
                                      setIsImageModalOpen(true)
                                    }}
                                    className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100"
                                  >
                                    <PhotographIcon className="h-5 w-5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setSelectedId(restaurant._id)
                                    setIsModalEditOpen(true)
                                  }}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-100"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedId(restaurant._id)
                                    setIsDeleteModalOpen(true)
                                  }}
                                  className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-100"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                            Không tìm thấy nhà hàng nào
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants && filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((restaurant) => (
                      <div
                        key={restaurant._id}
                        className="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
                      >
                        <div className="relative">
                          <img
                            className="h-48 w-full object-cover"
                            src={restaurant.avatar_url || "https://via.placeholder.com/400x200"}
                            alt={restaurant.name}
                          />
                          <div className="absolute top-2 right-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                restaurant.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {restaurant.is_active ? "Hoạt động" : "Không hoạt động"}
                            </span>
                          </div>
                        </div>
                        <div className="px-4 py-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900 truncate">{restaurant.name}</h3>
                            {renderStars(restaurant.average_rating || 0)}
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{restaurant.address}</p>
                          <p className="text-sm text-gray-500">{restaurant.phone}</p>

                          <div className="mt-2 flex justify-between text-sm">
                            <div>
                              <span className="text-gray-500">Danh mục:</span>{" "}
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {restaurant.category_id?.category_name || "N/A"}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Chủ sở hữu:</span>{" "}
                              <span>{restaurant.owner_id?.username || "N/A"}</span>
                            </div>
                          </div>

                          {restaurant.description && (
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{restaurant.description}</p>
                          )}
                        </div>
                        <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                          <button
                            onClick={() => {
                              setSelectedImages(restaurant.images || [])
                              setIsImageModalOpen(true)
                            }}
                            className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <PhotographIcon className="h-4 w-4 mr-1" />
                            {restaurant.images?.length || 0} ảnh
                          </button>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedId(restaurant._id)
                                setIsModalEditOpen(true)
                              }}
                              className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() =>
                                mutationToggleActive.mutate({
                                  id: restaurant._id,
                                  is_active: !restaurant.is_active,
                                })
                              }
                              className={`p-1 rounded-full ${
                                restaurant.is_active
                                  ? "text-yellow-600 hover:bg-yellow-100"
                                  : "text-green-600 hover:bg-green-100"
                              }`}
                            >
                              {restaurant.is_active ? <XIcon className="h-5 w-5" /> : <CheckIcon className="h-5 w-5" />}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedId(restaurant._id)
                                setIsDeleteModalOpen(true)
                              }}
                              className="p-1 rounded-full text-red-600 hover:bg-red-100"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-10">
                      <p className="text-gray-500">Không tìm thấy nhà hàng nào</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Trước
                  </button>
                  <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Sau
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">10</span> của{" "}
                      <span className="font-medium">{queryRestaurants.data?.length || 0}</span> kết quả
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span className="sr-only">Trước</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <button className="relative inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                        1
                      </button>
                      <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span className="sr-only">Sau</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Restaurant Modal */}
      {isModalEditOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Chỉnh sửa nhà hàng</h3>
                    <div className="mt-2">
                      {queryRestaurant.isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                          <p className="mt-4 text-gray-600">Đang tải dữ liệu nhà hàng...</p>
                        </div>
                      ) : queryRestaurant.isError ? (
                        <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
                          <p>Lỗi tải dữ liệu nhà hàng: {queryRestaurant.error?.message || "Lỗi không xác định"}</p>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmitEdit} className="mt-4">
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Tên nhà hàng
                              </label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Địa chỉ
                              </label>
                              <input
                                type="text"
                                name="address"
                                id="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Số điện thoại
                              </label>
                              <input
                                type="text"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                                Danh mục
                              </label>
                              <select
                                name="category_id"
                                id="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              >
                                <option value="">Chọn danh mục</option>
                                {queryCategories.data?.map((category) => (
                                  <option key={category._id} value={category._id}>
                                    {category.category_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label htmlFor="owner_id" className="block text-sm font-medium text-gray-700">
                                Chủ sở hữu
                              </label>
                              <select
                                name="owner_id"
                                id="owner_id"
                                value={formData.owner_id}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              >
                                <option value="">Chọn chủ sở hữu</option>
                                {queryOwners.data?.map((owner) => (
                                  <option key={owner._id} value={owner._id}>
                                    {owner.username} ({owner.fullname})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">
                                URL ảnh đại diện
                              </label>
                              <input
                                type="text"
                                name="avatar_url"
                                id="avatar_url"
                                value={formData.avatar_url}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Mô tả
                              </label>
                              <textarea
                                name="description"
                                id="description"
                                rows={3}
                                value={formData.description}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                              <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                                Ảnh nhà hàng (mỗi URL một dòng)
                              </label>
                              <textarea
                                name="images"
                                id="images"
                                rows={3}
                                value={formData.images?.join("\n")}
                                onChange={handleImagesChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                              {formData.images && formData.images.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {formData.images.map((image, index) => (
                                    <img
                                      key={index}
                                      src={image || "/placeholder.svg"}
                                      alt={`Preview ${index}`}
                                      className="h-16 w-16 rounded-md object-cover"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center">
                              <label htmlFor="is_active" className="mr-3 block text-sm font-medium text-gray-700">
                                Hoạt động
                              </label>
                              <button
                                type="button"
                                onClick={() => handleSwitchChange(!formData.is_active)}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${formData.is_active ? "bg-green-500" : "bg-gray-200"}`}
                                role="switch"
                                aria-checked={formData.is_active}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.is_active ? "translate-x-5" : "translate-x-0"}`}
                                />
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleSubmitEdit}
                  disabled={mutationUpdate.isPending}
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                >
                  {mutationUpdate.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalEditOpen(false)
                    resetForm()
                  }}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Restaurant Modal */}
      {isModalAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Thêm nhà hàng mới</h3>
                    <div className="mt-2">
                      <form onSubmit={handleSubmitAdd} className="mt-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Tên nhà hàng
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                              Địa chỉ
                            </label>
                            <input
                              type="text"
                              name="address"
                              id="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                              Số điện thoại
                            </label>
                            <input
                              type="text"
                              name="phone"
                              id="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                              Danh mục
                            </label>
                            <select
                              name="category_id"
                              id="category_id"
                              value={formData.category_id}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                              <option value="">Chọn danh mục</option>
                              {queryCategories.data?.map((category) => (
                                <option key={category._id} value={category._id}>
                                  {category.category_name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="owner_id" className="block text-sm font-medium text-gray-700">
                              Chủ sở hữu
                            </label>
                            <select
                              name="owner_id"
                              id="owner_id"
                              value={formData.owner_id}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                              <option value="">Chọn chủ sở hữu</option>
                              {queryOwners.data?.map((owner) => (
                                <option key={owner._id} value={owner._id}>
                                  {owner.username} ({owner.fullname})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">
                              URL ảnh đại diện
                            </label>
                            <input
                              type="text"
                              name="avatar_url"
                              id="avatar_url"
                              value={formData.avatar_url}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Mô tả
                            </label>
                            <textarea
                              name="description"
                              id="description"
                              rows={3}
                              value={formData.description}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                              Ảnh nhà hàng (mỗi URL một dòng)
                            </label>
                            <textarea
                              name="images"
                              id="images"
                              rows={3}
                              value={formData.images?.join("\n")}
                              onChange={handleImagesChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                          <div className="flex items-center">
                            <label htmlFor="is_active" className="mr-3 block text-sm font-medium text-gray-700">
                              Hoạt động
                            </label>
                            <button
                              type="button"
                              onClick={() => handleSwitchChange(!formData.is_active)}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${formData.is_active ? "bg-green-500" : "bg-gray-200"}`}
                              role="switch"
                              aria-checked={formData.is_active}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.is_active ? "translate-x-5" : "translate-x-0"}`}
                              />
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleSubmitAdd}
                  disabled={mutationAdd.isPending}
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                >
                  {mutationAdd.isPending ? "Đang thêm..." : "Thêm nhà hàng"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalAddOpen(false)
                    resetForm()
                  }}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Ảnh nhà hàng</h3>
                  <button onClick={() => setIsImageModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Restaurant image ${index + 1}`}
                          className="h-40 w-full rounded-lg object-cover"
                        />
                        <div className="absolute right-2 top-2 rounded-full bg-black bg-opacity-50 px-2 py-1 text-xs text-white">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Xóa nhà hàng</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa nhà hàng này? Hành động này không thể hoàn tác.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => mutationDelete.mutate(selectedId)}
                  disabled={mutationDelete.isPending}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  {mutationDelete.isPending ? "Đang xóa..." : "Xóa"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
