import { API_BASE_URL } from "../config/config";

export const fileFrom = (value) => {
  if (typeof File !== "undefined" && value instanceof File) return value;
  if (typeof FileList !== "undefined" && value instanceof FileList) return value[0] || null;
  if (Array.isArray(value)) return value.find((v) => typeof File !== "undefined" && v instanceof File) || null;
  return null;
};

export const featureArray = (value) => Array.isArray(value)
  ? value.map(String).map(v => v.trim()).filter(Boolean)
  : String(value || "").split(",").map(v => v.trim()).filter(Boolean);

export async function saveMultipart(resource, values, id) {
  const body = new FormData();
  for (const field of ["title", "description", "link"]) {
    body.append(field, values[field] ?? "");
  }
  featureArray(values.features).forEach((feature, index) => {
    body.append(`features[${index}]`, feature);
  });
  for (const field of ["image", "video"]) {
    const file = fileFrom(values[field]);
    if (file) body.append(field, file, file.name);
  }
  if (id != null) body.append("_method", "PATCH");
  const url = `${API_BASE_URL}/${resource}${id != null ? `/${id}` : ""}`;
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(localStorage.getItem("access_token") ? { Authorization: `Bearer ${localStorage.getItem("access_token")}` } : {}),
      },
      body,
    });
  } catch (err) {
    throw new Error(`Network request failed. Check API CORS, server availability and upload limits for ${url}. ${err.message}`);
  }
  const text = await response.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { message: text.slice(0, 400) }; }
  if (!response.ok) {
    const errors = json?.errors ? Object.values(json.errors).flat().join("; ") : "";
    throw new Error(errors || json?.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return json?.data ?? json;
}
