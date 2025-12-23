import React, { useEffect, useState } from "react";
import AdminForm from "../../components/ui/AdminForm";
import FileUpload from "../../components/ui/FileUpload";
import { useBlogStore } from "../../stors/useBlogStore";
import { useAuthStore } from "../../stors/useAuthStore";
import { Editor } from "@tinymce/tinymce-react";

export default function BlogFormTiny({ blogId, onSuccess, apiKey = "lmml35k9i4dyhe5swfgxoufuqhwpbcqgz25m38779fehig9r" }) {
  const { loading, selectedBlog, fetchBlogById, createBlog, updateBlog } = useBlogStore();
  const { admin } = useAuthStore();
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDesc] = useState(""); // HTML
  const [image, setImage] = useState(null); // File or URL string

  // load for edit
  useEffect(() => {
    if (!blogId) return;
    fetchBlogById(blogId);
  }, [blogId, fetchBlogById]);

  // Update form when selectedBlog changes
  useEffect(() => {
    if (selectedBlog) {
      setTitle(selectedBlog?.title || "");
      // Handle both "description" (from API response) and "content" (for form submission)
      setDesc(selectedBlog?.description || selectedBlog?.content || "");
      setImage(selectedBlog?.image || null); // can be URL
    }
  }, [selectedBlog]);

  const onFile = (e) => {
    const f = e.target.files?.[0] || null;
    setImage(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please fill in both title and content fields.");
      return;
    }

    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("content", description); // API expects "content" not "description"
      fd.append("is_active", "1"); // Default to active
      fd.append("user_name", admin?.name || "Admin"); // Get from auth store

      // only append if it's a new File; skip if unchanged string URL
      if (image instanceof File) fd.append("image", image);

      console.log("Submitting blog data:", {
        title: title.trim(),
        content: description.substring(0, 100) + "...",
        hasImage: image instanceof File,
        imageType: image ? image.type : 'N/A',
        imageSize: image ? image.size : 'N/A',
        is_active: "1",
        user_name: admin?.name || "Admin"
      });

      if (blogId) {
        await updateBlog(blogId, fd);
        // Refresh the blog data after update to ensure latest data is displayed
        await fetchBlogById(blogId);
      } else {
        await createBlog(fd);
      }

      onSuccess && onSuccess();
    } catch (err) {
      console.error("Blog creation error:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Unknown error occurred";
      console.error("Error details:", errorMessage);
      alert(`Error saving blog: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => onSuccess && onSuccess();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Loading blog…</p>
      </div>
    );
  }

  return (
    <AdminForm
      title={blogId ? "Edit Blog Post" : "Add New Blog Post"}
      onSubmit={submit}
      onCancel={cancel}
      submitText={saving ? "Saving..." : blogId ? "Update Blog" : "Create Blog"}
      submitDisabled={saving || !title.trim() || !description.trim()}
    >
      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Blog Title *
        </label>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={140}
          placeholder="Write a clear, searchable title…"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <p className="text-xs text-gray-500 mt-1">{title.length}/140</p>
      </div>

      {/* Image */}
      <div className="mb-6">
        <FileUpload
          label="Cover Image (optional)"
          name="image"
          value={image}
          onChange={onFile}
          accept="image/*"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Blog Content *
        </label>
        <Editor
          apiKey={apiKey}
          value={description}
          onEditorChange={(html) => {
            console.log("Editor content changed:", html.substring(0, 50) + "...");
            setDesc(html);
          }}
          init={{
            height: 520,
            menubar: false,
            plugins:
              "anchor autolink charmap code codesample directionality emoticons image link lists media preview searchreplace table visualblocks wordcount",
            toolbar:
              "undo redo | blocks | bold italic underline strikethrough | " +
              "align bullist numlist outdent indent | link image media table | " +
              "removeformat | ltr rtl | code preview",
            convert_urls: false,
            content_style:
              "body{font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif; font-size:15px; line-height:1.7;}",
            // Quick inline (base64) embeds for pasted images; switch to server upload if needed
            images_upload_handler: (blobInfo) =>
              new Promise((resolve) => {
                resolve("data:" + blobInfo.blob().type + ";base64," + blobInfo.base64());
              }),
            setup: (editor) => {
              console.log("TinyMCE editor initialized");
              editor.on('init', () => {
                console.log("TinyMCE editor ready");
              });
            }
          }}
        />
      </div>
    </AdminForm>
  );
}
