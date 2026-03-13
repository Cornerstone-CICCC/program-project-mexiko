import { useEffect, useState } from "react";
import api from "../services/api";

export default function UsersPage() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    }

    loadUsers();
  }, []);

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <h2 className="text-3xl font-bold mb-6">
        Users Management
      </h2>

      <table className="w-full">

        <thead className="border-b">
          <tr className="text-left text-sm text-gray-500">
            <th className="py-3">Name</th>
            <th>Email</th>
            <th>MBTI</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user: any) => (
            <tr key={user.id} className="border-b">

              <td className="py-4">{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mbti}</td>
              <td>{user.status}</td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}