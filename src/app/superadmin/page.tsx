import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserService } from "../../../lib/services/user.service";
import { FiUsers, FiActivity, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export default async function SuperAdminDashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Double-check authorization
  const isSuperAdmin = await UserService.isSuperAdmin(userId);
  if (!isSuperAdmin) {
    redirect("/");
  }

  const user = await currentUser();
  const dbUser = await UserService.getUserByClerkId(userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Super Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full">
              <FiCheckCircle className="w-5 h-5" />
              <span className="font-semibold">SUPER ADMIN</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Donors</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <FiActivity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Blood Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <FiAlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Approvals</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <FiCheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <p className="text-gray-500 text-center py-8">
                No recent activity to display
              </p>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Database</span>
                <span className="flex items-center text-green-600">
                  <FiCheckCircle className="w-4 h-4 mr-2" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Authentication</span>
                <span className="flex items-center text-green-600">
                  <FiCheckCircle className="w-4 h-4 mr-2" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600">Notifications</span>
                <span className="flex items-center text-green-600">
                  <FiCheckCircle className="w-4 h-4 mr-2" />
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
              Manage Users
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
              View Reports
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
              System Settings
            </button>
          </div>
        </div>

        {/* User Info (Debug) */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-800 text-gray-100 rounded-lg shadow-lg p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">Debug Info</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(
                {
                  clerkId: userId,
                  role: dbUser?.role,
                  email: dbUser?.email,
                  name: `${dbUser?.firstName} ${dbUser?.lastName}`,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
