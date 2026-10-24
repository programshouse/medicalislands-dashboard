import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

export default function Reviews() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const isForm = location.pathname.includes("/form");

  const handleAdd = () => {
    setEditing(null);
    navigate("/reviews/form");
    setShowForm(true);
  };

  const handleEdit = (review, onComplete) => {
    setEditing(review);
    navigate("/reviews/form", { state: { editingItem: review } });
    setShowForm(true);
    // Store the callback to be called after form success
    if (onComplete) {
      setEditing({ ...review, _onComplete: onComplete });
    }
  };

  const handleFormSuccess = () => {
    // Call the completion callback if it exists
    if (editing?._onComplete) {
      editing._onComplete();
    }
    if (location.pathname.includes("/form")) navigate("/reviews", { replace: true });
    setShowForm(false);
    setEditing(null);
  };

  if (isForm) {
    return <ReviewForm reviewId={editing?.id ?? location.state?.editingItem?.id} onSuccess={handleFormSuccess} />;
  }

  return <ReviewList onAdd={handleAdd} onEdit={handleEdit} />;
}
