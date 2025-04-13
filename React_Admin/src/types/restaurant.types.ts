import type { ReactNode } from "react"
import type { FormProps } from "antd"

export interface CategoryType {
  _id: string
  category_name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface OwnerType {
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

export interface CommentType {
  _id: string
  user_id: string
  content: string
  rating: number
  createdAt: string
  updatedAt: string
}

export interface RestaurantType {
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

export interface RestaurantResponse {
  statusCode: number
  message: string
  data: RestaurantType
}

export interface RestaurantFormData {
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

export interface ToggleActiveData {
  id: string
  is_active: boolean
}

export interface RestaurantFormProps {
  form: any
  onFinish: FormProps<RestaurantFormData>["onFinish"]
  isLoading: boolean
  categories: CategoryType[] | undefined
  owners: OwnerType[] | undefined
  categoriesLoading: boolean
  ownersLoading: boolean
  enableUpload?: boolean // Thêm thuộc tính enableUpload
}

export interface RestaurantTableProps {
  restaurants: RestaurantType[] | undefined
  isLoading: boolean
  error: Error | null
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, isActive: boolean) => void
}

export interface RestaurantModalProps {
  title: string
  open: boolean
  onOk: () => void
  onCancel: () => void
  children: ReactNode
  width?: number
}
