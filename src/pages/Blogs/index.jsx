import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";
import { useBlogStore } from "../../stors/useBlogStore";

export default function Blogs() {
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const { fetchBlogs } = useBlogStore();

  const isForm = location.pathname.includes('/form') || showForm;

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingBlog(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBlog(null);
    // Refresh blog list to show updated data
    fetchBlogs();
  };

  if (isForm) {
    return (
      <BlogForm 
        blogId={editingBlog?.id} 
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <BlogList 
      onEdit={handleEdit}
      onAdd={handleAdd}
    />
  );
}
