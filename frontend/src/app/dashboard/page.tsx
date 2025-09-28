"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import { ProjectCards } from "@/components/dashboard/ProjectCards";
import { ClientDistributionChart } from "@/components/dashboard/ClientDistributionChart";
import { ProgressGaugeChart } from "@/components/dashboard/ProgressGaugeChart";
import { GraphicWorkChart } from "@/components/dashboard/GraphicWorkChart";
import api from "@/services/api";

export default function Dashboard() {
  const [projectData, setProjectData] = useState(null);
  const [graphicData, setGraphicData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [projectRes, graphicRes, progressRes, clientRes] =
          await Promise.all([
            api.get("/dashboard/project-information"),
            api.get("/dashboard/graphic-work-information"),
            api.get("/dashboard/progress-information"),
            api.get("/dashboard/client-progress-information"),
          ]);

        setProjectData(projectRes.data.project);
        setGraphicData(graphicRes.data.graphic_work);
        setProgressData(progressRes.data.progress);
        setClientData(clientRes.data.client_progress);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <ProtectedRoute>
      <Layout>
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Dashboard Overview
          </h1>
          <div className="space-y-6">
            <ProjectCards data={projectData} loading={loading} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">
                  Work Distribution
                </h3>
                <GraphicWorkChart data={graphicData} loading={loading} />
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">
                  Client Distribution
                </h3>
                <ClientDistributionChart data={clientData} loading={loading} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Work Progress Overview</h3>
              <ProgressGaugeChart data={progressData} loading={loading} />
            </div>
          </div>
        </main>
      </Layout>
    </ProtectedRoute>
  );
}
