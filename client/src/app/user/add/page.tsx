"use client";

import React, { useState } from "react";
import styles from "./page.module.scss";
import { useAuth } from "../../../providers/AuthProvider";
import callAPI from "utils/callAPI";

interface ProductData {
  name: string;
  roomCategory: string;
  price: string;
  stock: string;
  categories: string;
}

interface APIResponse {
  message: string;
}

type Mode = "add" | "update" | "delete" | "updateStock";

function ProductManagerPage() {
  const [mode, setMode] = useState<Mode>("add");
  const [productId, setProductId] = useState("");
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    roomCategory: "",
    price: "",
    stock: "",
    categories: "",
  });

  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setProductId("");
    setProductData({
      name: "",
      roomCategory: "",
      price: "",
      stock: "",
      categories: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response: APIResponse;

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/product`;

      switch (mode) {
        case "add":
          response = await callAPI<APIResponse>(apiUrl, {
            method: "POST",
            body: {
              brand: productData.name,
              roomCategory: productData.roomCategory,
              price: parseFloat(productData.price),
              stock: parseInt(productData.stock),
              categories: productData.categories,
            },
          });
          break;

        case "update":
          response = await callAPI<APIResponse>(apiUrl, {
            method: "PUT",
            body: {
              productId,
              brand: productData.name,
              roomCategory: productData.roomCategory,
              price: parseFloat(productData.price),
              stock: parseInt(productData.stock),
              categories: productData.categories,
            },
          });
          break;

        case "delete":
          response = await callAPI<APIResponse>(`${apiUrl}/${productId}`, {
            method: "DELETE",
          });
          break;

        case "updateStock":
          response = await callAPI<APIResponse>(apiUrl, {
            method: "PATCH",
            body: {
              productId,
              stock: parseInt(productData.stock),
            },
          });
          break;

        default:
          throw new Error("Invalid mode");
      }

      alert(response.message);
      resetForm();
    } catch (error) {
      console.error("API Error:", error);
      alert("There was an error processing your request.");
    }
  };

  if (user?.role !== "admin") {
    return <div>You are not authorized to view this page</div>;
  }

  return (
    <div className={styles.page}>
      <h2>Product Manager</h2>

      <div className={styles.selectBox}>
        <select id="mode" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
          <option value="add">Add Product</option>
          <option value="update">Update Product</option>
          <option value="delete">Delete Product</option>
          <option value="updateStock">Update Stock</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        {mode !== "add" && (
          <div>
            <label htmlFor="productId">Product ID</label>
            <input type="text" id="productId" value={productId} onChange={(e) => setProductId(e.target.value)} required />
          </div>
        )}

        {(mode === "add" || mode === "update") && (
          <>
            <div>
              <label htmlFor="name">Brand</label>
              <input type="text" id="name" name="name" value={productData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <label htmlFor="roomCategory">Room Category</label>
              <input type="text" id="roomCategory" name="roomCategory" value={productData.roomCategory} onChange={handleInputChange} required />
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <input type="text" id="price" name="price" value={productData.price} onChange={handleInputChange} required />
            </div>
            <div>
              <label htmlFor="stock">Stock</label>
              <input type="text" id="stock" name="stock" value={productData.stock} onChange={handleInputChange} required />
            </div>
            <div>
              <label htmlFor="categories">Categories (comma-separated)</label>
              <input type="text" id="categories" name="categories" value={productData.categories} onChange={handleInputChange} required />
            </div>
          </>
        )}

        {mode === "updateStock" && (
          <div>
            <label htmlFor="stock">New Stock</label>
            <input type="text" id="stock" name="stock" value={productData.stock} onChange={handleInputChange} required />
          </div>
        )}

        <button type="submit">
          {
            {
              add: "Add Product",
              update: "Update Product",
              delete: "Delete Product",
              updateStock: "Update Stock",
            }[mode]
          }
        </button>
      </form>
    </div>
  );
}

export default ProductManagerPage;
