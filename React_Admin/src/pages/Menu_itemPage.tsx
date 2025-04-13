"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosClientPublic } from "../libs/axiosClient"
import { useSearchParams } from "react-router"
import type { AxiosError } from "axios"
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  XIcon as ExclamationIcon,
  ImageIcon as PhotographIcon,
  DollarSignIcon,
} from "lucide-react"

// Types
interface CategoryType {
  _id: string
  category_name: string
  description: string
  createdAt: string
  updatedAt: string
}

// Update the RestaurantType interface to match the API response
interface RestaurantType {
  _id: string
  name?: string
  address?: string
  phone?: string
  description?: string
  avatar_url?: string
}

// Update the MenuItemType interface to match the API response
interface MenuItemType {
  _id: string
  restaurant_id: string | RestaurantType
  name: string
  description: string
  category_id: CategoryType
  price: number
  comments: CommentType[]
  main_image_url: string
  additional_images: string[]
  createdAt: string
  updatedAt: string
}

// Update the MenuItemFormData interface
interface MenuItemFormData {
  id?: string
  name: string
  description: string
  category_id: string
  restaurant_id: string
  price: number
  main_image_url: string
  additional_images?: string[]
}

interface MenuItemResponse {
  statusCode: number
  message: string
  data: MenuItemType
}

// Declare CommentType interface
interface CommentType {
  _id: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function MenuItemsPage() {
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
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: "",
    description: "",
    category_id: "",
    restaurant_id: "",
    price: 0,
    main_image_url: "https://via.placeholder.com/150",
    additional_images: [],
  })

  const KEYs = {
    getMenuItems: () => ["menu_item", page, limit] as const,
    getMenuItem: (id: string) => ["menu_item", id] as const,
    getRestaurants: () => ["restaurants"] as const,
    getCategories: () => ["categories"] as const,
  }

  const queryClient = useQueryClient()

  // Fetch menu items
  const fetchMenuItems = async (): Promise<MenuItemType[]> => {
    try {
      const response = await axiosClientPublic.get("/menu_item");
      console.log('API Response:', response.data);
      
      // Kiểm tra cấu trúc response
      if (response.data && response.data.data && Array.isArray(response.data.data.menu_Item)) {
        return response.data.data.menu_Item; // Trả về mảng menu_Item
      }
      
      console.error('Invalid response format:', response.data);
      return [];
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  }

  const queryMenuItems = useQuery<MenuItemType[], Error>({
    queryKey: KEYs.getMenuItems(),
    queryFn: fetchMenuItems,
  });
  
  useEffect(() => {
    if (queryMenuItems.isSuccess && queryMenuItems.data) {
      console.log('Successfully fetched menu items:', queryMenuItems.data);
    }
    if (queryMenuItems.isError && queryMenuItems.error) {
      console.error('Error in queryMenuItems:', queryMenuItems.error);
    }
  }, [queryMenuItems.isSuccess, queryMenuItems.isError, queryMenuItems.data, queryMenuItems.error]);

  // Fetch restaurants
  const fetchRestaurants = async (): Promise<RestaurantType[]> => {
    const response = await axiosClientPublic.get("/restaurants")
    return response.data.restaurants
  }

  const queryRestaurants = useQuery({
    queryKey: KEYs.getRestaurants(),
    queryFn: fetchRestaurants,
  })

  // Fetch all categories
  const fetchCategories = async (): Promise<CategoryType[]> => {
    const response = await axiosClientPublic.get("/categoryMenuItem");
    return response.data.data.categoryMenuItems || [];
  }

  const queryCategories = useQuery({
    queryKey: KEYs.getCategories(),
    queryFn: fetchCategories,
  })

  // Delete menu item
  const deleteMenuItem = async (id: string): Promise<void> => {
    await axiosClientPublic.delete(`/menu_item/${id}`)
  }

  const mutationDelete = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYs.getMenuItems() })
      showToast("Xóa món ăn thành công!", "success")
      setIsDeleteModalOpen(false)
    },
    onError: (error: AxiosError) => {
      showToast(`Lỗi khi xóa món ăn: ${error.response?.data || "Lỗi không xác định"}`, "error")
    },
  })

  // Update menu item
  const updateMenuItem = async (formData: MenuItemFormData): Promise<MenuItemType> => {
    const { id, ...payload } = formData
    const response = await axiosClientPublic.put(`/menu_item/${id}`, {
      ...payload,
      main_image_url: payload.main_image_url || "https://via.placeholder.com/150",
      additional_images: payload.additional_images || [],
    })
    return response.data
  }

  const mutationUpdate = useMutation({
    mutationFn: updateMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYs.getMenuItems() })
      queryClient.invalidateQueries({ queryKey: KEYs.getMenuItem(selectedId) })
      showToast("Cập nhật món ăn thành công!", "success")
      setIsModalEditOpen(false)
      resetForm()
    },
    onError: (error: AxiosError) => {
      showToast(`Lỗi khi cập nhật món ăn: ${error.response?.data || "Lỗi không xác định"}`, "error")
    },
  })

  // Add menu item
  const addMenuItem = async (formData: Omit<MenuItemFormData, "id">): Promise<MenuItemType> => {
    const response = await axiosClientPublic.post("/menu_item", {
      ...formData,
      main_image_url: formData.main_image_url || "https://via.placeholder.com/150",
      additional_images: formData.additional_images || [],
    })
    return response.data
  }

  const mutationAdd = useMutation({
    mutationFn: addMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYs.getMenuItems() }); // Làm mới danh sách món ăn
      showToast("Thêm món ăn thành công!", "success");
      setIsModalAddOpen(false);
      resetForm();
    },
    onError: (error: AxiosError) => {
      showToast(`Lỗi khi thêm món ăn: ${error.response?.data || "Lỗi không xác định"}`, "error");
    },
  });

  // Fetch single menu item for editing
  const fetchMenuItem = async (): Promise<MenuItemResponse> => {
    const response = await axiosClientPublic.get(`/menu_item/${selectedId}`); // Sửa đường dẫn API
    return response.data;
  };

  const queryMenuItem = useQuery({
    queryKey: KEYs.getMenuItem(selectedId),
    queryFn: fetchMenuItem,
    enabled: selectedId !== "" && isModalEditOpen,
  })

  // Populate form fields
  const populateFormFields = (menuItemResponse: MenuItemResponse) => {
    const menuItemData = menuItemResponse.data
    setFormData({
      name: menuItemData.name,
      description: menuItemData.description,
      category_id:
        typeof menuItemData.category_id === "object" ? menuItemData.category_id._id : menuItemData.category_id,
      restaurant_id:
        typeof menuItemData.restaurant_id === "object" ? menuItemData.restaurant_id._id : menuItemData.restaurant_id,
      price: menuItemData.price,
      main_image_url: menuItemData.main_image_url,
      additional_images: menuItemData.additional_images,
    })
  }

  useEffect(() => {
    if (queryMenuItem.isSuccess && queryMenuItem.data) {
      populateFormFields(queryMenuItem.data)
    }
  }, [selectedId, queryMenuItem.data, queryMenuItem.isSuccess])

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category_id: "",
      restaurant_id: "",
      price: 0,
      main_image_url: "https://via.placeholder.com/150",
      additional_images: [],
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
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value } = target;

    if (name === "price") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const imagesArray = value.split("\n").filter((url) => url.trim() !== "")
    console.log("Additional Images:", imagesArray)
    setFormData((prev) => ({ ...prev, additional_images: imagesArray }))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation()
    }
  }

  // Toast
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000)
  }

  // Filter menu items by search term
  const filteredMenuItems = Array.isArray(queryMenuItems.data)
  ? queryMenuItems.data.filter((menuItem: MenuItemType) => {
      const nameMatch = menuItem.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
      const descriptionMatch = menuItem.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
      const restaurantMatch = typeof menuItem.restaurant_id === "object"
        ? menuItem.restaurant_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
        : queryRestaurants.data?.find((r) => r._id === menuItem.restaurant_id)?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;

      return nameMatch || descriptionMatch || restaurantMatch;
    })
  : [];

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý món ăn</h1>
          <p className="text-gray-500">Quản lý danh sách món ăn trong hệ thống</p>
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
                placeholder="Tìm kiếm món ăn..."
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
                Thêm món ăn
              </button>
            </div>
          </div>

          {/* Loading state */}
          {queryMenuItems.isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Đang tải danh sách món ăn...</p>
            </div>
          ) : queryMenuItems.isError ? (
            <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
              <ExclamationIcon className="h-6 w-6 mx-auto mb-2" />
              <p>Lỗi khi tải món ăn: {queryMenuItems.error?.message || "Lỗi không xác định"}.</p>
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
                          Món ăn
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Giá
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
                          Nhà hàng
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Bình luận
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
                      {filteredMenuItems.length > 0 ? (
                        filteredMenuItems.map((menuItem) => (
                          <tr key={menuItem._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-md object-cover"
                                    src={menuItem.main_image_url || "https://via.placeholder.com/150"}
                                    alt={menuItem.name}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{menuItem.name}</div>
                                  <div className="text-sm text-gray-500 line-clamp-1">{menuItem.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-medium">{formatCurrency(menuItem.price)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {menuItem.category_id?.category_name || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {typeof menuItem.restaurant_id === "object"
                                ? menuItem.restaurant_id.name || "N/A"
                                : queryRestaurants.data?.find((r) => r._id === menuItem.restaurant_id)?.name || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {menuItem.comments?.length || 0} bình luận
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(menuItem.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                {menuItem.additional_images && menuItem.additional_images.length > 0 && (
                                  <button
                                    onClick={() => {
                                      setSelectedImages(menuItem.additional_images)
                                      setIsImageModalOpen(true)
                                    }}
                                    className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100"
                                  >
                                    <PhotographIcon className="h-5 w-5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setSelectedId(menuItem._id)
                                    setIsModalEditOpen(true)
                                  }}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-100"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedId(menuItem._id)
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
                            Không tìm thấy món ăn nào
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMenuItems.length > 0 ? (
                    filteredMenuItems.map((menuItem) => (
                      <div
                        key={menuItem._id}
                        className="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
                      >
                        <div className="relative">
                          <img
                            className="h-48 w-full object-cover"
                            src={menuItem.main_image_url || "https://via.placeholder.com/400x200"}
                            alt={menuItem.name}
                          />
                        </div>
                        <div className="px-4 py-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900 truncate">{menuItem.name}</h3>
                            <div className="flex items-center">
                              <DollarSignIcon className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="font-medium text-gray-900">{formatCurrency(menuItem.price)}</span>
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{menuItem.description}</p>

                          <div className="mt-2 flex justify-between text-sm">
                            <div>
                              <span className="text-gray-500">Danh mục:</span>{" "}
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {menuItem.category_id?.category_name || "N/A"}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Nhà hàng:</span>{" "}
                              <span>
                                {typeof menuItem.restaurant_id === "object"
                                  ? menuItem.restaurant_id.name || "N/A"
                                  : queryRestaurants.data?.find((r) => r._id === menuItem.restaurant_id)?.name || "N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 flex justify-between text-sm">
                            <div>
                              <span className="text-gray-500">Bình luận:</span>{" "}
                              <span>{menuItem.comments?.length || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Ngày tạo:</span>{" "}
                              <span>{formatDate(menuItem.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                          <button
                            onClick={() => {
                              setSelectedImages(menuItem.additional_images || [])
                              setIsImageModalOpen(true)
                            }}
                            className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <PhotographIcon className="h-4 w-4 mr-1" />
                            {menuItem.additional_images?.length || 0} ảnh
                          </button>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedId(menuItem._id)
                                setIsModalEditOpen(true)
                              }}
                              className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedId(menuItem._id)
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
                      <p className="text-gray-500">Không tìm thấy món ăn nào</p>
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
                      <span className="font-medium">{filteredMenuItems.length}</span> kết quả
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

      {/* Edit Menu Item Modal */}
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
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Chỉnh sửa món ăn</h3>
                    <div className="mt-2">
                      {queryMenuItem.isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                          <p className="mt-4 text-gray-600">Đang tải dữ liệu món ăn...</p>
                        </div>
                      ) : queryMenuItem.isError ? (
                        <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
                          <p>Lỗi tải dữ liệu món ăn: {queryMenuItem.error?.message || "Lỗi không xác định"}</p>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmitEdit} className="mt-4">
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Tên món ăn
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
                              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Giá (VND)
                              </label>
                              <input
                                type="number"
                                name="price"
                                id="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="1000"
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
                              <label htmlFor="restaurant_id" className="block text-sm font-medium text-gray-700">
                                Nhà hàng
                              </label>
                              <select
                                name="restaurant_id"
                                id="restaurant_id"
                                value={formData.restaurant_id}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              >
                                <option value="">Chọn nhà hàng</option>
                                {queryRestaurants.data?.map((restaurant) => (
                                  <option key={restaurant._id} value={restaurant._id}>
                                    {restaurant.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label htmlFor="main_image_url" className="block text-sm font-medium text-gray-700">
                                URL ảnh đại diện
                              </label>
                              <input
                                type="text"
                                name="main_image_url"
                                id="main_image_url"
                                value={formData.main_image_url}
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
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                              <label htmlFor="additional_images" className="block text-sm font-medium text-gray-700">
                                Ảnh bổ sung (mỗi URL một dòng)
                              </label>
                              <textarea
                                name="additional_images"
                                id="additional_images"
                                rows={3}
                                value={formData.additional_images?.join("\n") || ""}
                                onChange={handleImagesChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                              {formData.additional_images && formData.additional_images.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {formData.additional_images.map((image, index) => (
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

      {/* Add Menu Item Modal */}
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
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Thêm món ăn mới</h3>
                    <div className="mt-2">
                      <form onSubmit={handleSubmitAdd} className="mt-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Tên món ăn
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
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                              Giá (VND)
                            </label>
                            <input
                              type="number"
                              name="price"
                              id="price"
                              value={formData.price}
                              onChange={handleInputChange}
                              required
                              min="0"
                              step="1000"
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
                            <label htmlFor="restaurant_id" className="block text-sm font-medium text-gray-700">
                              Nhà hàng
                            </label>
                            <select
                              name="restaurant_id"
                              id="restaurant_id"
                              value={formData.restaurant_id}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                              <option value="">Chọn nhà hàng</option>
                              {queryRestaurants.data?.map((restaurant) => (
                                <option key={restaurant._id} value={restaurant._id}>
                                  {restaurant.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="main_image_url" className="block text-sm font-medium text-gray-700">
                              URL ảnh đại diện
                            </label>
                            <input
                              type="text"
                              name="main_image_url"
                              id="main_image_url"
                              value={formData.main_image_url}
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
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label htmlFor="additional_images" className="block text-sm font-medium text-gray-700">
                              Ảnh bổ sung (mỗi URL một dòng)
                            </label>
                            <textarea
                              name="additional_images"
                              id="additional_images"
                              rows={3}
                              value={formData.additional_images?.join("\n") || ""}
                              onChange={handleImagesChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
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
                  {mutationAdd.isPending ? "Đang thêm..." : "Thêm món ăn"}
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
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Ảnh món ăn</h3>
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
                          alt={`Menu item image ${index + 1}`}
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
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Xóa món ăn</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa món ăn này? Hành động này không thể hoàn tác.
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