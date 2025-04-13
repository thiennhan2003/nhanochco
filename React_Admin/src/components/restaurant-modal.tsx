import { Modal } from "antd"
import type { RestaurantModalProps } from "../types/restaurant.types"

export const RestaurantModal = ({ title, open, onOk, onCancel, children, width = 700 }: RestaurantModalProps) => {
  return (
    <Modal title={title} centered open={open} onOk={onOk} onCancel={onCancel} width={width}>
      {children}
    </Modal>
  )
}
