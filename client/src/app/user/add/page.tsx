"use client";

import React, { useState } from "react";
import styles from "./page.module.scss";
import { useAuth } from "../../../providers/authProvider";
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

function AddProductPage() {
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
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetForm = () => {
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
      const response = await callAPI<APIResponse>(`${process.env.NEXT_PUBLIC_API_URL}/admin/product`, {
        method: "POST",
        body: {
          brand: productData.name,
          roomCategory: productData.roomCategory,
          price: parseFloat(productData.price),
          stock: parseInt(productData.stock),
          categories: productData.categories,
        },
      });

      alert(response.message);
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("There was an error adding the product. Please try again.");
    }
  };

  if (user?.role !== "admin") return <div>You are not authorized to view this page</div>;

  return (
    <div className={styles.page}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Product Name</label>
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
          <label htmlFor="categories">Categories (use string, seperate using commas)</label>
          <input type="text" id="categories" name="categories" value={productData.categories} onChange={handleInputChange} required />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProductPage;
