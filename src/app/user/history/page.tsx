"use client";

import React, { useEffect, useState } from "react";
import callAPI from "utils/callAPI";
import styles from "../order/page.module.scss";
import Link from "next/link";
import { useAuth } from "../../../providers/authProvider";

type OrderItem = {
  order_item_id: number;
  product_id: number;
  quantity: number;
  price_at_order: string;
};

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
    if (user?.role !== "deliverer") return;

    const fetchOrders = async () => {
      try {
        const response = await callAPI<{ orders: Order[] }>(`${process.env.NEXT_PUBLIC_API_URL}/deliverer/delivered-order`);
        setOrders(response.orders || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.role]);

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
            <p className={styles.total}>
              Total: $
              {selectedOrder.items
                .reduce((sum, item) => {
                  return sum + parseFloat(item.price_at_order) * item.quantity;
                }, 0)
                .toFixed(2)}
            </p>

            <button className={styles.closeButton} onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
