import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ServiceForm from "./ServiceForm";
import ServiceList from "./ServiceList";
import { useServicesStore } from "../../stors/useServicesStore";

export default function Services() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const { getAllServices } = useServicesStore();

  const isForm = location.pathname.includes("/form");

  const handleEdit = (service) => {
    setEditingService(service);
    navigate("/services/form", { state: { editingItem: service } });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    navigate("/services/form");
    setShowForm(true);
  };

  const handleShow = (service) => {
    navigate(`/services/${service.id}`);
  };

  const handleFormSuccess = () => {
    if (location.pathname.includes("/form")) navigate("/services", { replace: true });
    setShowForm(false);
    setEditingService(null);
    // Refresh the services list after successful create/update
    getAllServices();
  };

  if (isForm) {
    return (
      <ServiceForm
        serviceId={editingService?.id ?? location.state?.editingItem?.id}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <ServiceList onEdit={handleEdit} onAdd={handleAdd} onShow={handleShow} />
  );
}
