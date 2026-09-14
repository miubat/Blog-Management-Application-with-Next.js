"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile, uploadProfileImage } from "@/services/user.service";
import { getErrorMessage } from "@/lib/api";
import { validatePhoto, ACCEPT_ATTR } from "@/lib/photo";
import Avatar from "@/components/Avatar";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [firstname, setFirstname] = useState(user?.firstname || "");
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!firstname.trim() || !lastname.trim()) {
      setProfileError("First name and last name are required");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await updateProfile({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
      });
      updateUser(res.data.data);
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      setProfileError(getErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setPhotoError("");
    if (!file) {
      setSelectedFile(null);
      return;
    }
    const validationError = validatePhoto(file);
    if (validationError) {
      setPhotoError(validationError);
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setPhotoError("");
    try {
      const res = await uploadProfileImage(selectedFile);
      updateUser(res.data.data);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setPhotoError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Profile Image</h2>

        <div className="flex items-center gap-4">
          <Avatar user={user} size="lg" />
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT_ATTR}
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600"
            />
            {photoError && <p className="mt-1 text-xs text-red-600">{photoError}</p>}
          </div>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Profile Information</h2>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          {profileSuccess && (
            <p className="rounded bg-green-50 p-3 text-sm text-green-700">{profileSuccess}</p>
          )}
          {profileError && (
            <p className="rounded bg-red-50 p-3 text-sm text-red-600">{profileError}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">First Name</label>
              <input
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
              <input
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              value={user.email}
              readOnly
              className="w-full rounded border border-gray-200 bg-gray-100 px-3 py-2 text-gray-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <input
              value={user.role}
              readOnly
              className="w-full rounded border border-gray-200 bg-gray-100 px-3 py-2 capitalize text-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="rounded bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>
    </div>
  );
}
