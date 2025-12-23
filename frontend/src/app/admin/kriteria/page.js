"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function KriteriaPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ kode: "", nama: "", bobot: "", tipe: "benefit" });
  const [editingKode, setEditingKode] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    try {
      const res = await fetch(`${API}/admin/kriteria`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      const data = await res.json();
      let fetchedList = [];
      
      if (!res.ok) {
        console.error("Fetch Gagal:", data);
        alert(`Gagal memuat data: ${data.detail || "Terjadi kesalahan server."}`);
      } else {
        if (Array.isArray(data.data)) {
          fetchedList = data.data; 
        } else if (Array.isArray(data)) {
          fetchedList = data;
        }
      }
      setList(fetchedList);
    } catch (e) { 
      console.error("Koneksi error:", e); 
      alert("Gagal terhubung ke API.");
      setList([]); 
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (actionLoading) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/admin/kriteria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      if (res.ok) { 
        alert("Kriteria berhasil ditambahkan");
        setForm({ kode: "", nama: "", bobot: "", tipe: "benefit" }); 
        fetchAll();
      } else { 
        alert(`Error: ${data.detail || "Gagal tambah kriteria"}`); 
      }
    } catch (err) { 
      alert("Gagal terhubung ke server");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleEdit(e, kode) {
    e.preventDefault();
    if (actionLoading) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/admin/kriteria/${kode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        alert("Kriteria berhasil diperbarui");
        setForm({ kode: "", nama: "", bobot: "", tipe: "benefit" });
        setEditingKode(null);
        fetchAll();
      } else {
        const data = await res.json();
        alert(`Error: ${data.detail || "Gagal update kriteria"}`);
      }
    } catch (err) { 
      alert("Gagal terhubung ke server");
    } finally {
      setActionLoading(false);
    }
  }

  function handleEditStart(kriteria) {
    setEditingKode(kriteria.kode);
    setForm({
      kode: kriteria.kode,
      nama: kriteria.nama,
      bobot: kriteria.bobot,
      tipe: kriteria.tipe
    });
  }

  function handleEditCancel() {
    setEditingKode(null);
    setForm({ kode: "", nama: "", bobot: "", tipe: "benefit" });
  }

  async function handleDelete(kode) {
    if (!confirm("Hapus kriteria ini?")) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/admin/kriteria/${kode}`, { 
        method: "DELETE", 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (res.ok) {
        alert("Kriteria berhasil dihapus");
        fetchAll();
      } else {
        const data = await res.json();
        alert(`Error: ${data.detail || "Gagal hapus kriteria"}`);
      }
    } catch (err) { 
      alert("Gagal terhubung ke server");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#2F4F3A] mb-6">Data Kriteria</h1>

      <form onSubmit={editingKode ? (e) => handleEdit(e, editingKode) : handleAdd} className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
        <h2 className="text-lg font-semibold text-[#2F4F3A] mb-4">
          {editingKode ? "Edit Kriteria" : "Tambah Kriteria Baru"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            placeholder="Kode (C1)" 
            className="p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" 
            value={form.kode} 
            onChange={(e)=>setForm({...form,kode:e.target.value})} 
            disabled={editingKode !== null}
            required 
          />
          <input 
            placeholder="Nama Kriteria" 
            className="p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" 
            value={form.nama} 
            onChange={(e)=>setForm({...form,nama:e.target.value})} 
            required 
          />
          <input 
            placeholder="Bobot" 
            type="number" 
            step="0.01" 
            className="p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" 
            value={form.bobot} 
            onChange={(e)=>setForm({...form,bobot:e.target.value})} 
            required 
          />
          <select 
            className="p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition bg-white" 
            value={form.tipe} 
            onChange={(e)=>setForm({...form,tipe:e.target.value})}
          >
            <option value="benefit">Benefit</option>
            <option value="cost">Cost</option>
          </select>
        </div>
        <div className="flex gap-2 mt-4">
          <button 
            type="submit"
            disabled={actionLoading}
            className="px-6 py-2 bg-[#2F4F3A] text-white rounded-lg font-bold hover:bg-green-800 disabled:opacity-50 transition shadow-sm"
          >
            {actionLoading ? "Proses..." : editingKode ? "Simpan Perubahan" : "Tambah Kriteria"}
          </button>
          {editingKode && (
            <button 
              type="button"
              onClick={handleEditCancel}
              disabled={actionLoading}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 disabled:opacity-50 transition"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-green-50 text-[#2F4F3A]">
            <tr className="text-left">
              <th className="p-4">#</th>
              <th className="p-4">Kode</th>
              <th className="p-4">Nama</th>
              <th className="p-4 text-center">Bobot</th>
              <th className="p-4 text-center">Tipe</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((k, i) => (
              <tr key={k.kode} className="border-b hover:bg-green-50/20 transition">
                <td className="p-4 text-gray-500">{i+1}</td>
                <td className="p-4 font-mono font-bold text-gray-700">{k.kode}</td>
                <td className="p-4 text-gray-800">{k.nama}</td>
                <td className="p-4 text-center font-semibold text-green-700">{k.bobot}</td>
                <td className="p-4 text-center text-gray-600 italic uppercase text-xs font-bold">{k.tipe}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => handleEditStart(k)} 
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(k.kode)} 
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-md hover:bg-red-600 disabled:opacity-50 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-400 italic">
                  Tidak ada data kriteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}