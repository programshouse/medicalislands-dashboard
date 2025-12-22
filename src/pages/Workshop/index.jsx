import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import WorkshopForm from "./WorkshopForm";
import WorkshopList from "./WorkshopList";
import WorkshopView from "../../components/ui/WorkshopView";

export default function Workshop() {
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [viewingWorkshop, setViewingWorkshop] = useState(null);

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
    setViewingWorkshop(workshop);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingWorkshop(null);
  };

  const handleCloseView = () => {
    setViewingWorkshop(null);
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
    <>
      <WorkshopList 
        onEdit={handleEdit}
        onAdd={handleAdd}
        onShow={handleShow}
      />
      {viewingWorkshop && (
        <WorkshopView 
          workshopId={viewingWorkshop.id}
          onClose={handleCloseView}
        />
      )}
    </>
  );
}
