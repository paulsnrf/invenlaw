"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AkunSayaForm({ initialData, lang, dict }: { initialData: any, lang: string, dict: any }) {
  const router = useRouter();
  const { update } = useSession();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phoneNumber: initialData?.phoneNumber || "",
    profession: initialData?.profession || "",
    institution: initialData?.institution || "",
    province: initialData?.province || "",
    city: initialData?.city || "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  
  // Fetch Provinces
  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error("Failed to load provinces", err));
  }, []);

  // Fetch Cities when Province changes
  useEffect(() => {
    if (formData.province && provinces.length > 0) {
      const selectedProv = provinces.find(p => p.name === formData.province);
      if (selectedProv) {
        fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProv.id}.json`)
          .then((res) => res.json())
          .then((data) => {
            setCities(data);
          })
          .catch((err) => console.error("Failed to load cities", err));
      }
    }
  }, [formData.province, provinces]);

  const universities = [
    "Universitas Indonesia", "Universitas Gadjah Mada", "Institut Teknologi Bandung", 
    "Universitas Padjadjaran", "Universitas Diponegoro", "Universitas Airlangga", 
    "Universitas Brawijaya", "Institut Pertanian Bogor", "Universitas Sebelas Maret", "Lainnya"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(dict.success_msg);
        await update({ name: formData.name });
        router.refresh();
      } else {
        setError(result.error || dict.error_msg);
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-500 text-sm animate-in fade-in zoom-in duration-300">
          {success}
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm animate-in fade-in zoom-in duration-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">{dict.full_name}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/[0.03] border border-white/10 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 rounded-xl px-4 py-3 text-white transition-all outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">{dict.email_readonly}</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full bg-white/[0.01] border border-white/5 text-zinc-500 rounded-xl px-4 py-3 outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">{dict.phone}</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">+62</span>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setFormData(prev => ({ ...prev, phoneNumber: val }));
              }}
              placeholder="81234567890"
              className="w-full bg-white/[0.03] border border-white/10 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 rounded-xl pl-12 pr-4 py-3 text-white transition-all outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">{dict.profession}</label>
          <select
            name="profession"
            value={formData.profession}
            onChange={(e) => {
              handleChange(e);
              setFormData(prev => ({ ...prev, institution: "" }));
            }}
            className="w-full bg-white/[0.03] border border-white/10 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 rounded-xl px-4 py-3 text-white transition-all outline-none appearance-none"
            required
          >
            <option value="" disabled>Pilih profesi Anda</option>
            <option value="Mahasiswa">Mahasiswa</option>
            <option value="Advokat">Advokat</option>
            <option value="Notaris">Notaris</option>
          </select>
        </div>

        {formData.profession && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-sm font-medium text-zinc-400">
              {formData.profession === "Mahasiswa" ? dict.institution_uni : dict.institution_office}
            </label>
            
            {formData.profession === "Mahasiswa" ? (
              <select
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/10 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 rounded-xl px-4 py-3 text-white transition-all outline-none appearance-none"
                required
              >
                <option value="" disabled>Pilih universitas</option>
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                placeholder={formData.profession}
                className="w-full bg-white/[0.03] border border-white/10 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 rounded-xl px-4 py-3 text-white transition-all outline-none"
                required
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">{dict.province}</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="w-full bg-white/[0.03] border border-white/10 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 rounded-xl px-4 py-3 text-white transition-all outline-none appearance-none"
              required
            >
              <option value="" disabled>Pilih Provinsi</option>
              {provinces.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">{dict.city}</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!formData.province || cities.length === 0}
              className="w-full bg-white/[0.03] border border-white/10 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 rounded-xl px-4 py-3 text-white transition-all outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="" disabled>Pilih Kota</option>
              {cities.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : null}
            {dict.save_btn}
          </button>
        </div>
      </form>
    </div>
  );
}
