import { RestaurantForm } from "./restaurant-form"
import { RestaurantModal } from "./restaurant-modal"
import type { RestaurantFormData } from "../types/restaurant.types"

interface AddRestaurantModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: Omit<RestaurantFormData, "id">) => void
  categoriesQuery: any
  ownersQuery: any
  form: any
}

export const AddRestaurantModal = ({
  isOpen,
  onClose,
  onSubmit,
  categoriesQuery,
  ownersQuery,
  form,
}: AddRestaurantModalProps) => {
  return (
    <RestaurantModal
      title="Thêm nhà hàng"
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        onClose()
        form.resetFields()
      }}
    >
      <RestaurantForm
        form={form}
        onFinish={onSubmit}
        isLoading={false}
        categories={categoriesQuery.data}
        owners={ownersQuery.data}
        categoriesLoading={categoriesQuery.isLoading}
        ownersLoading={ownersQuery.isLoading}
      />
    </RestaurantModal>
  )
}
