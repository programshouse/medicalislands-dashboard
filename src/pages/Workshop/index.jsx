import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WorkshopForm from "./WorkshopForm";
import WorkshopList from "./WorkshopList";

export default function Workshop() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState(null);

  const isForm = location.pathname.includes('/form');

  const handleEdit = (workshop) => {
    setEditingWorkshop(workshop);
    navigate("/workshop/form", { state: { editingItem: workshop } });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingWorkshop(null);
    navigate("/workshop/form");
    setShowForm(true);
  };

  const handleShow = (workshop) => {
    navigate(`/workshop/${workshop.id}`);
  };

  const handleFormSuccess = () => {
    if (location.pathname.includes("/form")) navigate("/workshop", { replace: true });
    setShowForm(false);
    setEditingWorkshop(null);
  };

  if (isForm) {
    return (
      <WorkshopForm 
        workshopId={editingWorkshop?.id ?? location.state?.editingItem?.id} 
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
