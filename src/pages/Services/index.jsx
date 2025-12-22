import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ServiceForm from "./ServiceForm";
import ServiceList from "./ServiceList";
import ServiceDetailModal from "../../components/ui/ServiceDetailModal";
import { useServicesStore } from "../../stors/useServicesStore";

export default function Services() {
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { getAllServices } = useServicesStore();

  const isForm = location.pathname.includes("/form") || showForm;

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleShow = (service) => {
    setSelectedService(service);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedService(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingService(null);
    // Refresh the services list after successful create/update
    getAllServices();
  };

  if (isForm) {
    return (
      <ServiceForm
        serviceId={editingService?.id}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <>
      <ServiceList onEdit={handleEdit} onAdd={handleAdd} onShow={handleShow} />
      <ServiceDetailModal
        service={selectedService}
        isOpen={showDetailModal}
        onClose={handleCloseModal}
      />
    </>
  );
}
