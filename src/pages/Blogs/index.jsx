import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";
import { useBlogStore } from "../../stors/useBlogStore";

export default function Blogs() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const { fetchBlogs } = useBlogStore();

  const isForm = location.pathname.includes('/form');

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    navigate("/blogs/form", { state: { editingItem: blog } });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingBlog(null);
    navigate("/blogs/form");
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    if (location.pathname.includes("/form")) navigate("/blogs", { replace: true });
    setShowForm(false);
    setEditingBlog(null);
    // Refresh blog list to show updated data
    fetchBlogs();
  };

  if (isForm) {
    return (
      <BlogForm 
        blogId={editingBlog?.id ?? location.state?.editingItem?.id} 
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
