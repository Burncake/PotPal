<template>
  <div class="admin-layout">
    <!-- Admin Sidebar -->
    <AdminSidebar />

    <!-- Main Content -->
    <div class="admin-content">
      <main class="admin-main">
        <div class="admin-header">
          <h2 class="admin-page-title">Orders</h2>
        </div>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th class="admin-th w-[15%]">Order ID</th>
                <th class="admin-th w-[15%]">User ID</th>
                <th class="admin-th w-[15%]">Status</th>
                <th class="admin-th w-[15%]">Total Cost</th>
                <th class="admin-th w-[20%]">Order Date</th>
                <th class="admin-th w-[20%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.orderID" class="admin-tr">
                <td class="admin-td">{{ order.orderID }}</td>
                <td class="admin-td">{{ order.userID }}</td>
                <td class="admin-td">
                  <span :class="getStatusClass(order.orderStatus)">
                    {{ order.orderStatus }}
                  </span>
                </td>
                <td class="admin-td">{{ formatPrice(order.totalCost) }}</td>
                <td class="admin-td">{{ formatDate(order.orderDate) }}</td>
                <td class="admin-td text-right">
                  <button @click="viewOrderDetails(order)" class="admin-action-button">
                    <EyeIcon class="admin-action-icon" />
                  </button>
                  <button @click="openUpdateStatusModal(order)" class="admin-action-button">
                    <EditIcon class="admin-action-icon"/>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <!-- View Order Modal -->
    <div v-if="showViewModal" class="admin-modal-overlay flex items-center justify-center">
      <div class="admin-modal max-w-4xl w-full">
        <h2 class="admin-modal-title">Order Details</h2>
        <div class="admin-form">
          <div class="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h3 class="text-lg font-semibold mb-2">Order Information</h3>
              <p><strong>Order ID:</strong> {{ selectedOrder.orderID }}</p>
              <p><strong>Status:</strong> {{ selectedOrder.orderStatus }}</p>
              <p><strong>Total Cost:</strong> {{ formatPrice(selectedOrder.totalCost) }}</p>
              <p><strong>Order Date:</strong> {{ formatDate(selectedOrder.orderDate) }}</p>
              <p><strong>Payment Method:</strong> {{ selectedOrder.payMethod }}</p>
              <p><strong>Discount ID:</strong> {{ selectedOrder.discountID || 'N/A' }}</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-2">Customer Information</h3>
              <p><strong>User ID:</strong> {{ selectedOrder.userID }}</p>
              <p><strong>Phone Number:</strong> {{ selectedOrder.phoneNumber }}</p>
              <p><strong>Address:</strong> {{ selectedOrder.address }}</p>
            </div>
          </div>
          <div class="mb-4">
            <h3 class="text-lg font-semibold mb-2">Order Details</h3>
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th class="text-left">Product ID</th>
                  <th class="text-left">Product Name</th>
                  <th class="text-right">Quantity</th>
                  <th class="text-right">Price</th>
                  <th class="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="detail in orderDetails" :key="detail.prodID">
                  <td>{{ detail.prodID }}</td>
                  <td>{{ detail.prodName }}</td>
                  <td class="text-right">{{ detail.quantity }}</td>
                  <td class="text-right">{{ formatPrice(detail.price) }}</td>
                  <td class="text-right">{{ formatPrice(detail.price * detail.quantity) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="selectedOrder.note" class="mb-4">
            <h3 class="text-lg font-semibold mb-2">Note</h3>
            <p>{{ selectedOrder.note }}</p>
          </div>
          <div class="admin-modal-footer">
            <button @click="closeViewModal" class="admin-button-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Status Modal -->
    <div v-if="showUpdateStatusModal" class="admin-modal-overlay flex items-center justify-center">
      <div class="admin-modal max-w-md w-full">
        <h2 class="admin-modal-title">Update Order Status</h2>
        <div class="admin-form">
          <div class="mb-4">
            <label for="orderStatus" class="block text-sm font-medium text-gray-700">New Status</label>
            <span>&nbsp;&nbsp;</span>
            <select
              id="orderStatus"
              v-model="newStatus"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipping">Shipping</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
          <div class="admin-modal-footer">
            <button @click="closeUpdateStatusModal" class="admin-button-secondary mr-2">
              Cancel
            </button>
            <button @click="updateOrderStatus" class="admin-button-primary">
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/styles/admin-layout.css'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { ref, onMounted } from 'vue'
import { EyeIcon, EditIcon } from 'lucide-vue-next'

const orders = ref([])
const showViewModal = ref(false)
const showUpdateStatusModal = ref(false)
const selectedOrder = ref(null)
const orderDetails = ref([])
const newStatus = ref('')

const apiUrl = 'https://676d499b0e299dd2ddff0c39.mockapi.io/orders/orders'
const productApiUrl = 'https://6754193836bcd1eec85023b2.mockapi.io/api/products'

onMounted(async () => {
  await fetchOrders()
})

const fetchOrders = async () => {
  try {
    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error('Network response was not ok')
    orders.value = await response.json()
  } catch (error) {
    console.error('Error fetching orders:', error)
  }
}

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
  return new Date(date).toLocaleString(undefined, options)
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

const getStatusClass = (status) => {
  const baseClasses = 'admin-status-badge'
  switch (status) {
    case 'Delivered':
      return `${baseClasses} admin-status-available`
    case 'Canceled':
      return `${baseClasses} admin-status-outofstock`
    default:
      return `${baseClasses} admin-status-default`
  }
}

const viewOrderDetails = async (order) => {
  selectedOrder.value = order
  await fetchOrderDetails(order.orderDetails)
  showViewModal.value = true
}

const fetchOrderDetails = async (details) => {
  try {
    const response = await fetch(productApiUrl)
    if (!response.ok) throw new Error('Network response was not ok')
    const products = await response.json()
    orderDetails.value = details.map(detail => {
      const product = products.find(p => p.prodID === detail.prodID)
      return {
        ...detail,
        prodName: product ? product.prodName : 'Unknown Product',
        price: product ? product.price : 0
      }
    })
  } catch (error) {
    console.error('Error fetching product details:', error)
  }
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedOrder.value = null
  orderDetails.value = []
}

const openUpdateStatusModal = (order) => {
  selectedOrder.value = order
  newStatus.value = order.orderStatus
  showUpdateStatusModal.value = true
}

const closeUpdateStatusModal = () => {
  showUpdateStatusModal.value = false
  selectedOrder.value = null
  newStatus.value = ''
}

const updateOrderStatus = async () => {
  try {
    const response = await fetch(`${apiUrl}/${selectedOrder.value.orderID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderStatus: newStatus.value }),
    })

    if (!response.ok) throw new Error('Network response was not ok')

    // Update the order status in the local state
    const updatedOrder = await response.json()
    const index = orders.value.findIndex(o => o.orderID === updatedOrder.orderID)
    if (index !== -1) {
      orders.value[index] = updatedOrder
    }

    closeUpdateStatusModal()
    // You might want to add a success message here
  } catch (error) {
    console.error('Error updating order status:', error)
    // You might want to add an error message here
  }
}
</script>

<style scoped>
.admin-modal {
  padding: 2rem;
}

.admin-modal table th,
.admin-modal table td {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
}

.admin-modal table th {
  background-color: #f8fafc;
}

</style>

