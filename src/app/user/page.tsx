"use client";

import React, { useState } from "react";
import { useAuth } from "../../providers/authProvider";
import styles from "./page.module.scss";
import callAPI from "utils/callAPI";

function User() {
  const { user, logout } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const handleEdit = () => {
    setIsEditOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleSave = async () => {
    try {
      await callAPI(`${process.env.NEXT_PUBLIC_API_URL}/auth/edit`, {
        method: "POST",
        body: {
          email,
          password,
        },
      });

      alert("Account updated successfully!");
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating account:", error);
      alert(`Failed to update account: ${error}`);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await callAPI(`${process.env.NEXT_PUBLIC_API_URL}/auth/delete`, {
        method: "DELETE",
      });

      alert("Account deleted successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(`Failed to delete account: ${error}`);
    } finally {
      setIsDeleteOpen(false);
    }
  };

  const handleClose = () => {
    setIsEditOpen(false);
    setIsDeleteOpen(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className={styles.container}>
      <h2>{user?.role} Information</h2>
      <p>
        <strong>ID:</strong> {user?.id}
      </p>
      <p>
        <strong>Email:</strong> {user?.email}
      </p>

      <div className={styles.buttonGroup}>
        <button onClick={handleEdit} className={styles.editButton}>
          Edit
        </button>
        <button onClick={handleDelete} className={styles.deleteButton}>
          Delete
        </button>
      </div>

      <button onClick={handleLogout} className={styles.logoutButton}>
        Log Out
      </button>

      {isEditOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Edit Account</h3>
            <input type="email" placeholder="New Email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} />
            <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} />
            <div className={styles.modalButtons}>
              <button onClick={handleSave} className={styles.saveButton}>
                Save
              </button>
              <button onClick={handleClose} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Are you sure you want to delete your account?</h3>
            <div className={styles.modalButtons}>
              <button onClick={handleConfirmDelete} className={styles.deleteConfirmButton}>
                Yes, Delete
              </button>
              <button onClick={handleClose} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
