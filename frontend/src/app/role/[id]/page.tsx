// 'use client';

// import { useState, useEffect, use } from "react";
// import { useRouter } from "next/navigation";
// import api from "@/services/api";
// import { ProtectedRoute } from "@/components/ProtectedRoute";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ArrowLeft, Save } from "lucide-react";
// import Layout from "@/components/layout/Layout";
// import { Role } from "@/types/role";

// export default function RolePage({ params }: { params: Promise<{ id: string }> }) {
//   const router = useRouter();
  
//   const [role, setRole] = useState<Role | null>(null);
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<Error | null>(null);
//   const resolvedParams = use(params);
//   const { id } = resolvedParams;

//   useEffect(() => {
//     const fetchRole = async () => {
//       try {
//         const response = await api.get(`/roles/${id}`);
//         const data = response.data;
//         setRole(data.role);
//         setName(data.role.name);
//       } catch (err: any) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRole();
//   }, [id]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       await api.put(`/roles/${id}`, { name });
//       router.push('/role');
//     } catch (err: any) {
//       setError(err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <ProtectedRoute>
//         <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//         </div>
//       </ProtectedRoute>
//     );
//   }

//   return (
//     <ProtectedRoute>
//       <Layout>
//         <div className="min-h-screen bg-gray-50 p-8">
//           <div className="max-w-3xl mx-auto">
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <div className="flex items-center mb-6">
//                 <Button
//                   variant="ghost"
//                   onClick={() => router.push('/role')}
//                   className="mr-4"
//                 >
//                   <ArrowLeft size={20} />
//                 </Button>
//                 <h1 className="text-2xl font-bold text-gray-900">Edit Role</h1>
//               </div>

//               {error && (
//                 <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
//                   {error.message}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Role Name
//                   </label>
//                   <Input
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="flex justify-end">
//                   <Button
//                     type="submit"
//                     disabled={saving}
//                     className="flex items-center"
//                   >
//                     {saving && (
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     )}
//                     <Save size={16} className="mr-2" />
//                     Save Changes
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </Layout>
//     </ProtectedRoute>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/services/api";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import {
  showSuccess,
  showError,
  showValidationErrors,
} from "@/services/toastService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Role } from "@/types/role";

// ------------------- Component -------------------
export default function CreateRole() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null);


  const [formData, setFormData] = useState<{ name: string }>({
    name: "",
  });

  useEffect(() => {
    const fetchRole = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/roles/${id}`);
        const role = response.data.role;
        setFormData(role);
        console.log(role);

      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRole();
  }, [id]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ------------------- Submit -------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post(`/roles/${id}?_method=PUT`, formData);
      showSuccess("Role created successfully!");
      router.push("/role");
    } catch (error: any) {
      if (error.response?.status === 422) {
        showValidationErrors(error.response.data.errors);
      } else {
        showError("Failed to create role!");
      }
    } finally {
      setSaving(false);
    }
  };

  // ------------------- Render -------------------
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-6 sm:px-16 py-8">
          <h1 className="text-2xl font-bold mb-6">Edit Role</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <LabelInputContainer>
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter role name"
                required
              />
            </LabelInputContainer>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="cursor-pointer px-6"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

// ------------------- Helper -------------------
function LabelInputContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
}
