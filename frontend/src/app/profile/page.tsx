"use client";

import React from "react";
import "leaflet/dist/leaflet.css";
import Layout from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProfileSettingsForm } from "@/components/profile/profile-form";


export default function ProfileSettingsPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-white text-blue-950 flex items-center justify-center p-4 overflow-hidden">
          <div className="shadow-input mx-auto w-full max-w-3xl rounded-xl bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Profile Settings</h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">update data diri anda.</p>
            <ProfileSettingsForm />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}