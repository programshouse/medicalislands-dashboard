import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import AdminForm from "../../components/ui/AdminForm";
import Toaster, { notify } from "../../components/ui/Toaster/Toaster";
import { useSettingsStore } from "../../stors/useSettingsStore";

const SocialRow = React.memo(function SocialRow({ label, value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-28 items-center justify-start text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>

      <input
        type="url"
        inputMode="url"
        placeholder="https://"
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
          disabled
            ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed border-gray-200 dark:border-gray-700"
            : "border-gray-300"
        }`}
        value={value}
        onChange={(e) => !disabled && onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
});

export default function SettingsForm({ onSuccess }) {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isReadOnly =
    searchParams.get("readonly") === "1" || searchParams.get("mode") === "view";

  const loading = useSettingsStore((s) => s.loading);
  const settings = useSettingsStore((s) => s.settings);
  const error = useSettingsStore((s) => s.error);

  const fetchSettings = useSettingsStore((s) => s.fetchSettings);
  const getSettingsById = useSettingsStore((s) => s.getSettingsById);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    siteName: "",
    email: "",
    phone: "",
    address: "",
    socials: {
      facebook: "",
      whatsapp: "",
      instagram: "",
      twitter: "",
      linkedin: "",
    },
  });

  const seed = (data) => {
    if (!data) return;

    setForm({
      siteName: data?.site_name || data?.siteName || "",
      email: data?.email || "",
      phone: data?.phone || "",
      address: data?.address || "",
      socials: {
        facebook: data?.facebook || data?.socials?.facebook || "",
        whatsapp: data?.whatsapp || data?.socials?.whatsapp || "",
        instagram: data?.instagram || data?.socials?.instagram || "",
        twitter: data?.twitter || data?.socials?.twitter || "",
        linkedin: data?.linkedin || data?.socials?.linkedin || "",
      },
    });
  };

  // ✅ Load by id (if exists) otherwise load current settings
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = id ? await getSettingsById(id) : await fetchSettings();
        if (!mounted) return;
        seed(data || settings);
      } catch (e) {
        console.error("Settings load error:", e);
        notify.action("fetch").error("Failed to load settings");
      }
    };

    // if settings already available, seed directly
    if (settings) seed(settings);
    else load();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const setField = (name, value) => setForm((p) => ({ ...p, [name]: value }));
  const setSocial = (k, v) =>
    setForm((p) => ({ ...p, socials: { ...p.socials, [k]: v } }));

  const valid = useMemo(() => {
    return (
      form.siteName.trim().length > 0 &&
      form.phone.trim().length > 0 &&
      form.address.trim().length > 0
    );
  }, [form]);

  const submit = async (e) => {
    e.preventDefault();

    if (isReadOnly) {
      onSuccess && onSuccess();
      return;
    }

    if (!valid) return;

    try {
      setSaving(true);
      await updateSettings(form);
      notify.action("update").success("Settings saved successfully");
      onSuccess && onSuccess();
    } catch (err) {
      console.error("Failed to save settings:", err);
      notify.action("update").error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white";

  const disabledCls = isReadOnly
    ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed border-gray-200 dark:border-gray-700"
    : "border-gray-300";

  const validationHint = useMemo(() => {
    if (isReadOnly) return "";
    if (!form.siteName.trim()) return "Please enter Site Name.";
    if (!form.phone.trim()) return "Please enter Phone.";
    if (!form.address.trim()) return "Please enter Address.";
    return "";
  }, [form, isReadOnly]);

  return (
    <div title={`${isReadOnly ? "View" : "Edit"} Settings | ProfMSE`}>
      <Toaster position="bottom-right" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader title={`${isReadOnly ? "View" : "Edit"} Settings`} />

        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            Loading settings…
          </div>
        )}

        {!loading && error && <div className="text-center text-red-600">{String(error)}</div>}

        {!loading && !error && (
          <AdminForm
            title="Site Information"
            onSubmit={submit}
            onCancel={onSuccess}
            submitText={isReadOnly ? "Close" : saving ? "Saving..." : "Save Settings"}
            submitDisabled={isReadOnly ? false : saving || !valid}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Name *
                </label>
                <input
                  type="text"
                  value={form.siteName}
                  onChange={(e) => setField("siteName", e.target.value)}
                  className={`${inputCls} ${disabledCls}`}
                  required
                  maxLength={140}
                  disabled={isReadOnly}
                />
                <p className="text-xs text-gray-500 mt-1">{form.siteName.length}/140</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className={`${inputCls} ${disabledCls}`}
                  required
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className={`${inputCls} ${disabledCls}`}
                  required
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                  className={`${inputCls} ${disabledCls}`}
                  required
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Social Links
              </h3>

              <SocialRow
                label="Facebook"
                value={form.socials.facebook}
                onChange={(v) => setSocial("facebook", v)}
                disabled={isReadOnly}
              />
              <SocialRow
                label="WhatsApp"
                value={form.socials.whatsapp}
                onChange={(v) => setSocial("whatsapp", v)}
                disabled={isReadOnly}
              />
              <SocialRow
                label="Instagram"
                value={form.socials.instagram}
                onChange={(v) => setSocial("instagram", v)}
                disabled={isReadOnly}
              />
              <SocialRow
                label="Twitter"
                value={form.socials.twitter}
                onChange={(v) => setSocial("twitter", v)}
                disabled={isReadOnly}
              />
              <SocialRow
                label="LinkedIn"
                value={form.socials.linkedin}
                onChange={(v) => setSocial("linkedin", v)}
                disabled={isReadOnly}
              />
            </div>

            {!isReadOnly && !valid && (
              <div className="mt-4 text-sm text-amber-600 dark:text-amber-400">
                {validationHint}
              </div>
            )}
          </AdminForm>
        )}
      </div>
    </div>
  );
}
