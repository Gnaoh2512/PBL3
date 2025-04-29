"use client";

import React, { useEffect, useState } from "react";
import callAPI from "utils/callAPI";
import styles from "./page.module.scss";
import Link from "next/link";
import { useAuth } from "../../../providers/authProvider";

// Define the OrderItem type for individual items
type OrderItem = {
  order_item_id: number;
  product_id: number;
  quantity: number;
  price_at_order: string;
};

// Define the Order type
type Order = {
  order_id: number;
  status: string;
  time: string;
  items: OrderItem[];
};

function Page() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await callAPI<{ orders: Order[] }>(`${process.env.NEXT_PUBLIC_API_URL}/${user?.role}/order`);
        console.log("Orders fetched:", response.orders);
        setOrders(response.orders || []);

      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.role]);

  const markAsDelivered = async () => {
    if (!selectedOrder) return;

    try {
      setIsLoading(true);

      await callAPI(`${process.env.NEXT_PUBLIC_API_URL}/deliverer/order`, {
        method: "PUT",
        body: { orderId: selectedOrder.order_id, delivererId: user?.id },
      });

      const updatedOrders = orders.filter((order) => order.order_id !== selectedOrder.order_id);
      setOrders(updatedOrders);
      setSelectedOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className={styles.empty}>No orders found</div>;
  }

  return (
    <div className={styles.orders}>
      <h1>Your Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.order_id} className={styles.orderItem} onClick={() => setSelectedOrder(order)}>
            <h2>{new Date(order.time).toLocaleDateString()}</h2>
            <p>Status: {order.status}</p>
          </li>
        ))}
      </ul>

      {selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Items:</h3>
            <ul>
              {selectedOrder.items.map((item) => (
                <Link href={`/products/${item.product_id}`} key={item.order_item_id}>
                  <li className={styles.orderItemDetails}>
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}/img/${item.product_id}_1.webp`} alt={`Product ${item.product_id}`} className={styles.productImage} />
                    <div className={styles.itemDetails}>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price at Order: ${item.price_at_order}</p>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>

            {user?.role === "deliverer" && (
              <button className={styles.delivererButton} onClick={markAsDelivered}>
                Mark as Delivered
              </button>
            )}

            <button className={styles.closeButton} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
