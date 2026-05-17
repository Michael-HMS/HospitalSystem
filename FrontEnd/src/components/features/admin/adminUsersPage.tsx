import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { UsersService } from "../../../services/users-service";
import DetailModal from "../../ui/modal";
import { TiUser, TiMail, TiPhone, TiKey } from "react-icons/ti";
import { BiShield } from "react-icons/bi";
import type { IUser } from "../../../interfaces/IUser";

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Added filter parameter state for user access profiles
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchLiveUsers = async () => {
      try {
        setError(null);
        const data = await UsersService.getAllUsers();
        setUsers(data || []);
      } catch (err) {
        console.error("Failed to load users from service registry:", err);
        setError(t("Failed to fetch user accounts. Please check connection."));
      }
    };
    fetchLiveUsers();
  }, [t]);

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
    const email = (u.email || "").toLowerCase();
    const query = search.toLowerCase();
    
    const matchesSearch = fullName.includes(query) || email.includes(query);
    const matchesRole = roleFilter === "all" || u.role?.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesSearch && matchesRole;
  });

  const getUserModalProps = (user: IUser) => {
    const normalizedRole = user.role?.charAt(0).toUpperCase() + user.role?.slice(1).toLowerCase();
    const roleColors: Record<string, "info" | "success" | "warning" | "default"> = {
      Admin: "warning",
      Doctor: "success",
      Patient: "info"
    };

    return {
      title: `${user.first_name} ${user.last_name}`,
      subtitle: `${t("Profile Registry Link")}: #${user.user_id}`,
      icon: <TiUser />,
      badge: {
        label: normalizedRole.toUpperCase(),
        variant: roleColors[normalizedRole] || "default"
      },
      sections: [
        {
          heading: t("Account Access Configuration"),
          fields: [
            { icon: <TiKey />, label: t("System Unique UID"), value: user.user_id },
            { icon: <BiShield />, label: t("Security Permission"), value: normalizedRole },
          ]
        },
        {
          heading: t("Communication Metadata"),
          fields: [
            { icon: <TiMail />, label: t("Primary Email"), value: user.email },
            { icon: <TiPhone />, label: t("Phone Number"), value: user.phone || t("N/A") }
          ]
        }
      ],
      actions: [{ label: t("Dismiss Profile"), onClick: () => setSelectedUser(null) }]
    };
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold tracking-tight">{t("System Core User Matrix")}</h2>
        <p className="text-xs text-slate mt-0.5">{t("Manage roles, track authentication permissions, and inspect clinical account entities.")}</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
        <input
          type="text"
          placeholder={t("Search users by name or secure email address...")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-xl border border-slate/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-base"
        />
        
        {/* Added role taxonomy filter tool dropdown */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-base"
        >
          <option value="all">{t("All Roles")}</option>
          <option value="admin">{t("Admin")}</option>
          <option value="doctor">{t("Doctor")}</option>
          <option value="patient">{t("Patient")}</option>
        </select>
      </div>

      {error ? (
        <div className="text-center py-12 text-sm text-red-500">{error}</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate">{t("No matching users found.")}</div>
      ) : (
        <div className="border border-slate/15 rounded-2xl overflow-hidden bg-background">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate/5 border-b border-slate/15 text-slate uppercase tracking-wider font-semibold">
                <th className="p-4">UID</th>
                <th className="p-4">{t("User Name")}</th>
                <th className="p-4">{t("Email Address")}</th>
                <th className="p-4">{t("System Role")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10">
              {filteredUsers.map((user) => (
                <tr
                  key={user.user_id}
                  onClick={() => setSelectedUser(user)}
                  className="hover:bg-slate/5 cursor-pointer transition-colors"
                >
                  <td className="p-4 font-mono">#{user.user_id}</td>
                  <td className="p-4 font-semibold">{user.first_name} {user.last_name}</td>
                  <td className="p-4 text-slate">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                      user.role?.toLowerCase() === "admin" ? "bg-amber-100 text-amber-800" :
                      user.role?.toLowerCase() === "doctor" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <DetailModal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} {...getUserModalProps(selectedUser)} />
      )}
    </div>
  );
}