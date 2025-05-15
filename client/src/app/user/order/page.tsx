"use client";

import React, { useCallback, useEffect, useState } from "react";
import callAPI from "utils/callAPI";
import styles from "./page.module.scss";
import Link from "next/link";
import { useAuth } from "../../../providers/authProvider";
import { Order, SelectedOrder } from "types";

function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<SelectedOrder | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "delivered">("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { user } = useAuth();

  const fetchOrders = useCallback(async () => {
    try {
      const fetchedOrders = await callAPI<Order[]>(`${process.env.NEXT_PUBLIC_API_URL}/${user?.role}/order`);

      setOrders(fetchedOrders || []);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleClick = async (order: Order) => {
    const selected = await callAPI<SelectedOrder>(`${process.env.NEXT_PUBLIC_API_URL}/${user?.role}/order/${order.order_id}`);

    if (selected) {
      setSelectedOrder(selected);
    }
  };

  const markAsDelivered = async () => {
    if (!selectedOrder) return;

    try {
      setIsLoading(true);

      const result = await callAPI<{ message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/deliverer/order`, {
        method: "PUT",
        body: {
          orderId: selectedOrder.order.order_id,
        },
      });
      alert(result.message);

      setOrders((prev) => prev.filter((o) => o.order_id !== selectedOrder.order.order_id));
      setSelectedOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className={styles.empty}>No orders found</div>;
  }

  return (
    <div className={styles.orders}>
      <div className={styles.top}>
        <h1>{user?.role !== "customer" ? "Orders need to be delivered" : "Your Orders"}</h1>
        <div className={styles.controls}>
          {user?.role !== "deliverer" && (
            <button onClick={() => setFilterStatus((prev) => (prev === "all" ? "pending" : prev === "pending" ? "delivered" : "all"))}>
              Show: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
            </button>
          )}

          <button onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}>Date: {sortDirection === "asc" ? "Ascending" : "Descending"}</button>
        </div>
      </div>
      <div className={styles.orderList}>
        {orders
          .filter((order) => {
            if (filterStatus === "all") return true;
            return order.status.toLowerCase() === filterStatus;
          })
          .sort((a, b) => {
            const aTime = Date.parse(a.time);
            const bTime = Date.parse(b.time);
            return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
          })
          .map((order) => (
            <li key={order.order_id} className={styles.orderItem} onClick={() => handleClick(order)}>
              <span>{new Date(order.time).toLocaleDateString()}</span>
              <span>{order.status}</span>
            </li>
          ))}
      </div>

      {selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Items:</h3>
            <ul>
              {selectedOrder.items.map((item, index) => (
                <li className={styles.orderItemDetails} key={index}>
                  <Link href={`/products/${item.product_id}`}>
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}/img/${item.product_id}_1.webp`} alt={`Product ${item.product_id}`} className={styles.productImage} />
                  </Link>
                  <div className={styles.itemDetails}>
                    <p>Quantity: {item.quantity}</p>
                    <p>
                      Price at Order: <span style={{ color: "#629460" }}>${item.price_at_order}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <p className={styles.total}>
              Total: <span style={{ color: "#629460" }}>${selectedOrder.items.reduce((sum, item) => sum + parseFloat(item.price_at_order) * item.quantity, 0).toFixed(2)}</span>
            </p>

            {user?.role === "deliverer" && (
              <button className={styles.delivererButton} onClick={markAsDelivered}>
                Mark as Delivered
              </button>
            )}

            <button className={styles.closeButton} onClick={() => setSelectedOrder(null)}>
              Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
