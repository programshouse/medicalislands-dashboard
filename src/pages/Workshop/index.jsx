import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WorkshopForm from "./WorkshopForm";
import WorkshopList from "./WorkshopList";

export default function Workshop() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState(null);

  const isForm = location.pathname.includes('/form') || showForm;

  const handleEdit = (workshop) => {
    setEditingWorkshop(workshop);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingWorkshop(null);
    setShowForm(true);
  };

  const handleShow = (workshop) => {
    navigate(`/workshop/${workshop.id}`);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingWorkshop(null);
  };

  if (isForm) {
    return (
      <WorkshopForm 
        workshopId={editingWorkshop?.id} 
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <WorkshopList 
      onEdit={handleEdit}
      onAdd={handleAdd}
      onShow={handleShow}
    />
  );
}
