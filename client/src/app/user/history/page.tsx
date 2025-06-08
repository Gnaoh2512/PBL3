"use client";

import React, { useEffect, useState } from "react";
import callAPI from "utils/callAPI";
import styles from "../order/page.module.scss";
import Link from "next/link";
import { useAuth } from "../../../providers/AuthProvider";
import { Order, OrderItem, SelectedOrder } from "types";

function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<SelectedOrder | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "order_id">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { user } = useAuth();
  const isDeliverer = user?.role === "deliverer";

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isDeliverer) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await callAPI<Order[]>(`${process.env.NEXT_PUBLIC_API_URL}/deliverer/delivered-order`);
        console.log(response);
        setOrders(response || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isDeliverer]);

  if (isLoading) {
    return <div className={styles.loading}>Loading orders...</div>;
  }

  if (!isDeliverer) {
    return <div className={styles.restricted}>Access restricted to deliverers only.</div>;
  }

  if (orders.length === 0) {
    return <div className={styles.empty}>No orders found</div>;
  }

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + parseFloat(item.price_at_order) * item.quantity, 0).toFixed(2);
  };

  const handleClick = async (order: Order) => {
    const selected = await callAPI<SelectedOrder>(`${process.env.NEXT_PUBLIC_API_URL}/${user?.role}/order/${order.order_id}`);

    if (selected) {
      setSelectedOrder(selected);
    }
  };

  return (
    <div className={styles.orders}>
      <div className={styles.top}>
        <h1>Your Delivered-Orders</h1>
        <div className={styles.controls}>
          <button onClick={() => setSortBy((prev) => (prev === "date" ? "order_id" : "date"))}>Sort By: {sortBy === "date" ? "Date" : "Order ID"}</button>

          <button onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}>Direction: {sortDirection === "asc" ? "Ascending" : "Descending"}</button>
        </div>
      </div>

      <div className={styles.orderList}>
        {[...orders]
          .sort((a, b) => {
            const fieldA = sortBy === "date" ? new Date(a.time).getTime() : a.order_id;
            const fieldB = sortBy === "date" ? new Date(b.time).getTime() : b.order_id;

            return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
          })
          .map((order) => (
            <li key={order.order_id} className={styles.orderItem} onClick={() => handleClick(order)}>
              <span>ID: {order.order_id}</span>
              <span>{new Date(order.time).toLocaleDateString()}</span>
            </li>
          ))}
      </div>

      {selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Items:</h3>
            <ul>
              {selectedOrder.items.map((item) => (
                <Link href={`/products/${item.product_id}`} key={item.product_id}>
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
            <p className={styles.total}>Total: ${calculateTotal(selectedOrder.items)}</p>
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
