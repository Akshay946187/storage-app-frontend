import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const base_url = "http://localhost:3000";

interface User {
  _id: string;
  name: string;
  email: string;
  isLogedIn: boolean;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const navigate = useNavigate();

  async function getAllUsers() {
    try {
      setLoading(true);
      const response = await fetch(`${base_url}/user/Users`, {
        credentials: "include",
      });

      if (response.status === 403 || response.status === 401) {
        navigate("/");
        return;
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user permanently?")) return;
    try {
      setActionId(id);
      await fetch(`${base_url}/user/delete-user/${id}`, {
        method: "POST",
        credentials: "include",
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } finally {
      setActionId(null);
    }
  };

  const handleLogout = async (id: string) => {
    try {
      setActionId(id);
      const response = await fetch(`${base_url}/user/logout-user/${id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      await getAllUsers();
    } finally {
      setActionId(null);
    }
  };

  const loggedInCount = users.filter((u) => u.isLogedIn).length;

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              All Users
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage accounts, sessions and access for your admin dashboard.
            </p>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            <StatPill label="Total" value={users.length} tone="indigo" />
            <StatPill label="Online" value={loggedInCount} tone="emerald" />
            <StatPill
              label="Offline"
              value={users.length - loggedInCount}
              tone="slate"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl shadow-black/30 backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <SkeletonRows />
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-16 text-center text-slate-500"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const busy = actionId === user._id;
                    return (
                      <tr
                        key={user._id}
                        className="group transition-colors hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">
                              {user.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <span className="font-medium text-slate-100">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                              user.isLogedIn
                                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20"
                                : "bg-slate-500/10 text-slate-400 ring-1 ring-inset ring-slate-500/20"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                user.isLogedIn
                                  ? "bg-emerald-400"
                                  : "bg-slate-500"
                              }`}
                            />
                            {user.isLogedIn ? "Logged In" : "Logged Out"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleLogout(user._id)}
                              disabled={busy}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Logout
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              disabled={busy}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "indigo" | "emerald" | "slate";
}) {
  const tones = {
    indigo: "bg-indigo-500/10 text-indigo-300 ring-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
    slate: "bg-slate-500/10 text-slate-300 ring-slate-500/20",
  } as const;

  return (
    <div
      className={`rounded-xl px-4 py-2 ring-1 ring-inset ${tones[tone]}`}
    >
      <div className="text-xs uppercase tracking-wide opacity-80">
        {label}
      </div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-slate-800" />
              <div className="h-3 w-32 rounded bg-slate-800" />
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="h-3 w-48 rounded bg-slate-800" />
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-24 rounded-full bg-slate-800" />
          </td>
          <td className="px-6 py-4">
            <div className="ml-auto h-8 w-32 rounded-lg bg-slate-800" />
          </td>
        </tr>
      ))}
    </>
  );
}

export default Users;