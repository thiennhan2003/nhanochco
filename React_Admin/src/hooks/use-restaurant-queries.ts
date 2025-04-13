import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosClientPublic } from "../libs/axiosClient"
import type {
  RestaurantType,
  RestaurantResponse,
  RestaurantFormData,
  ToggleActiveData,
  OwnerType,
  CategoryType,
} from "../types/restaurant.types"

export const useRestaurantQueries = (page: number, limit: number, selectedId: string, isModalEditOpen: boolean) => {
  const queryClient = useQueryClient()

  const KEYs = {
    getRestaurants: () => ["restaurants", page, limit] as const,
    getRestaurant: (id: string) => ["restaurant", id] as const,
    getOwners: () => ["owners"] as const,
    getCategories: () => ["categories"] as const,
  }

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
    },
    onError: (error) => {
      console.error("Error deleting restaurant:", error)
    },
  })

  // Update restaurant
  const updateRestaurant = async (formData: RestaurantFormData): Promise<RestaurantType> => {
    const { id, ...payload } = formData
    const response = await axiosClientPublic.put(`/restaurants/${id}`, {
      ...payload,
      avatar_url: payload.avatar_url || ""
    })
    return response.data
  }

  const mutationUpdate = useMutation({
    mutationFn: updateRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYs.getRestaurants() })
      queryClient.invalidateQueries({ queryKey: KEYs.getRestaurant(selectedId) })
    },
    onError: (error) => {
      console.error("Error updating restaurant:", error)
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
    },
    onError: (error) => {
      console.error("Error toggling restaurant active status:", error)
    },
  })

  // Add restaurant
  const addRestaurant = async (formData: Omit<RestaurantFormData, "id">): Promise<RestaurantType> => {
    const response = await axiosClientPublic.post("/restaurants", {
      ...formData,
      avatar_url: formData.avatar_url || ""
    })
    return response.data
  }

  const mutationAdd = useMutation({
    mutationFn: addRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYs.getRestaurants() })
    },
    onError: (error) => {
      console.error("Error adding restaurant:", error)
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

  return {
    queryRestaurants,
    queryOwners,
    queryCategories,
    queryRestaurant,
    mutationDelete,
    mutationUpdate,
    mutationToggleActive,
    mutationAdd,
  }
}
