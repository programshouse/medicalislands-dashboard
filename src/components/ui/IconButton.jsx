import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const IconButton = ({ 
  icon, 
  variant = "default", 
  size = "sm", 
  onClick, 
  title, 
  className = "",
  disabled = false 
}) => {
  const baseClasses = "flex items-center justify-center transition-colors";
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };
  
  const variantClasses = {
    default: "border border-gray-300 bg-white hover:bg-gray-50",
    edit: "border border-gray-300 bg-white hover:bg-gray-50",
    delete: "border border-red-300 bg-white hover:bg-red-50",
    view: "border border-brand-300 bg-white hover:bg-gray-50"
  };
  
  const iconColors = {
    default: "text-gray-600",
    edit: "text-gray-600", 
    delete: "text-red-600",
    view: "text-brand-300"
  };
  
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  
  const IconComponent = icon;
  
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} rounded-lg ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <IconComponent className={`${iconSizes[size]} ${iconColors[variant]}`} />
    </button>
  );
};

// Pre-configured icon buttons
export const ViewButton = ({ onClick, size = "sm", className = "", disabled = false }) => (
  <IconButton
    icon={Eye}
    variant="view"
    size={size}
    onClick={onClick}
    title="View"
    className={className}
    disabled={disabled}
  />
);

export const EditButton = ({ onClick, size = "sm", className = "", disabled = false }) => (
  <IconButton
    icon={Pencil}
    variant="edit"
    size={size}
    onClick={onClick}
    title="Edit"
    className={className}
    disabled={disabled}
  />
);

export const DeleteButton = ({ onClick, size = "sm", className = "", disabled = false }) => (
  <IconButton
    icon={Trash2}
    variant="delete"
    size={size}
    onClick={onClick}
    title="Delete"
    className={className}
    disabled={disabled}
  />
);

export default IconButton;
