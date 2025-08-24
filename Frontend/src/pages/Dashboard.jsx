import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [stores, setStores] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  // Fetch all stores
  const fetchStores = async () => {
    try {
      const res = await API.get("/stores");
      setStores(res.data);
    } catch (error) {
      setMessage("Failed to load stores");
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    fetchStores();
  }, []);

  // Open rating modal
  const openRatingModal = (store) => {
    setSelectedStore(store);
    setRating(store.userRating || 0); // pre-fill if user has rated
  };

  // Submit or update rating
  const submitRating = async () => {
    try {
      await API.post("/ratings", {
        store_id: selectedStore.id,
        rating: Number(rating),
      });
      setMessage("Rating submitted successfully");
      setSelectedStore(null);
      fetchStores(); // refresh list
    } catch (error) {
      setMessage("Failed to submit rating");
    }
  };

  // Delete store (Admin only)
  const deleteStore = async (storeId) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;
    try {
      await API.delete(`/stores/${storeId}`);
      setMessage("Store deleted successfully");
      setStores(stores.filter((s) => s.id !== storeId));
    } catch (error) {
      setMessage("Failed to delete store");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Welcome, {user?.name}</h2>
      <p>Email: {user?.email}</p>
      <p>
        <strong>Role:</strong> {user?.role}
      </p>

      {message && <div className="alert alert-info">{message}</div>}

      {/* Add Store Button for Admin/Owner */}
      {(user?.role === "admin" || user?.role === "owner") && (
        <button
          className="btn btn-success mb-3"
          onClick={() => navigate("/add-store")}
        >
          Add New Store
        </button>
      )}

      {/* Stores Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>Average Rating</th>
            <th>Your Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stores.length > 0 ? (
            stores.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.address}</td>
                <td>{store.avgRating || "-"}</td>
                <td>{store.userRating || "-"}</td>
                <td>
                  {user?.role === "user" && (
                    <>
                      {!store.userRating ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => openRatingModal(store)}
                        >
                          Rate
                        </button>
                      ) : (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => openRatingModal(store)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      )}
                    </>
                  )}
                  {user?.role === "owner" && (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => navigate(`/edit-store/${store.id}`)}
                    >
                      Edit
                    </button>
                  )}
                  {user?.role === "admin" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteStore(store.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No stores available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Rating Modal */}
      {selectedStore && user?.role === "user" && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedStore.name} -{" "}
                  {selectedStore.userRating ? "Update Rating" : "Rate"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedStore(null)}
                ></button>
              </div>
              <div className="modal-body">
                <select
                  className="form-select"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="0">Select rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedStore(null)}
                >
                  Close
                </button>
                <button
                  className="btn btn-success"
                  onClick={submitRating}
                  disabled={rating === 0}
                >
                  Save Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
