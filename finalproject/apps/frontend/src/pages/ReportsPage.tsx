import { useEffect, useState } from "react";
import api from "../services/api";

export default function ReportsPage() {

  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function loadReports() {
      const res = await api.get("/admin/reports");
      setReports(res.data);
    }

    loadReports();
  }, []);

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <h2 className="text-3xl font-bold mb-6">
        Report Moderation
      </h2>

      <table className="w-full">

        <thead className="border-b">
          <tr className="text-left text-sm text-gray-500">
            <th className="py-3">Reporter</th>
            <th>Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((report: any) => (
            <tr key={report.id} className="border-b">

              <td className="py-4">{report.reporter}</td>
              <td>{report.type}</td>
              <td>{report.status}</td>

              <td>
                <button className="text-indigo-600 font-semibold">
                  Review
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}