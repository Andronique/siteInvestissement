"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Coins,
  Users,
  Clipboard,
  Link as LinkIcon,
  FileText,
  LayoutList,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreerMission({
  userPoints,
  setUserPoints,
  myMissions,
  setMyMissions,
  missions,
  setMissions,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(true);
  const [newMission, setNewMission] = useState({
    title: "",
    url: "",
    type: "like",
    maxExecutors: "",
    points: "",
    description: "",
    validationType: "manual",
  });

  const router = useRouter();
  const formRef = useRef(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      router.push("/auth/login");
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  useEffect(() => {
    if (showCreateForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showCreateForm]);

  const handleCreateMission = (e) => {
    e.preventDefault();
    const totalCost =
      parseInt(newMission.points || 0) * parseInt(newMission.maxExecutors || 0);
    if (totalCost > userPoints) {
      toast.error("Points insuffisants pour créer cette mission");
      return;
    }

    setUserPoints((prev) => prev - totalCost);
    setMyMissions((prev) => prev + 1);
    setMissions([
      ...missions,
      {
        ...newMission,
        id: Date.now().toString(),
        currentExecutors: 0,
        createdAt: new Date().toISOString(),
      },
    ]);
    toast.success("Mission créée avec succès !");
    setShowCreateForm(false);
    setNewMission({
      title: "",
      url: "",
      type: "like",
      maxExecutors: "",
      points: "",
      description: "",
      validationType: "manual",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-600 to-red-800 text-white overflow-x-hidden font-sans">
      <div className="relative z-10 p-4 sm:p-6 max-w-5xl mx-auto">
        {/* Retour */}
        <div className="flex justify-start items-center mb-6">
          <Link href="/microtasks">
            <button className="group flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-300">
              <ArrowLeft className="w-6 h-6 mr-2" />
              Retour
            </button>
          </Link>
        </div>

        {/* Titre */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 drop-shadow-md">
            CRÉER UNE MISSION
          </h1>
          <p className="text-white/80 mt-2 text-base sm:text-lg">
            Créez une mission ciblée et efficace
          </p>
        </div>

        {/* Statistiques */}
        <div className="bg-white/90 border-2 border-green-600 text-black rounded-xl p-4 sm:p-5 mb-6 max-w-2xl mx-auto">
          <div className="flex items-center text-red-600 font-bold text-lg sm:text-xl mb-3">
            <Clipboard className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Créer une mission
          </div>
          <div className="space-y-2 text-sm sm:text-base text-gray-700">
            <div className="flex items-center">
              <Coins className="w-5 h-5 mr-2 text-gray-600" />
              Mes points : <strong className="text-black">{userPoints}</strong>
            </div>
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-gray-600" />
              Missions enregistrées :{" "}
              <strong className="text-black">{myMissions}</strong>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        {showCreateForm && (
          <div
            ref={formRef}
            className="bg-red-500/10 border-2 border-emerald-500/40 rounded-xl p-4 sm:p-6 shadow-lg mx-auto max-w-2xl"
          >
            <form onSubmit={handleCreateMission} className="space-y-5 sm:space-y-6">
              {/* Titre */}
              <InputField
                label="Titre *"
                icon={<Clipboard className="text-white w-5 h-5" />}
                value={newMission.title}
                onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                placeholder="Ex: Liker ma vidéo"
                required
              />

              {/* URL */}
              <InputField
                label="Lien à promouvoir *"
                icon={<LinkIcon className="text-white w-5 h-5" />}
                value={newMission.url}
                onChange={(e) => setNewMission({ ...newMission, url: e.target.value })}
                placeholder="https://..."
                required
              />

              {/* Type */}
              <SelectField
                label="Type de mission *"
                icon={<LayoutList className="text-white w-5 h-5" />}
                value={newMission.type}
                onChange={(e) => setNewMission({ ...newMission, type: e.target.value })}
                options={[
                  { value: "like", label: "Like" },
                  { value: "subscribe", label: "S'abonner" },
                  { value: "watch", label: "Regarder" },
                ]}
              />

              {/* Nombre d'exécutants */}
              <InputField
                label="Nombre d'exécutants *"
                icon={<Users className="text-white w-5 h-5" />}
                type="number"
                value={newMission.maxExecutors}
                onChange={(e) => setNewMission({ ...newMission, maxExecutors: e.target.value })}
                placeholder="100"
                required
              />

              {/* Points */}
              <InputField
                label="Points par action *"
                icon={<Coins className="text-white w-5 h-5" />}
                type="number"
                value={newMission.points}
                onChange={(e) => setNewMission({ ...newMission, points: e.target.value })}
                placeholder="1"
                required
              />

              {/* Description */}
              <div>
                <label className="block text-white font-medium mb-1">Description *</label>
                <div className="flex items-start bg-red-900/50 rounded-xl overflow-hidden">
                  <div className="bg-green-600 p-2">
                    <FileText className="text-white w-5 h-12" />
                  </div>
                  <textarea
                    value={newMission.description}
                    onChange={(e) =>
                      setNewMission({ ...newMission, description: e.target.value })
                    }
                    className="w-full bg-red-950 text-white px-3 py-2 focus:outline-none placeholder-white/50"
                    placeholder="Décrivez la tâche..."
                    rows={2}
                    required
                  />
                </div>
              </div>

              {/* Validation */}
              <div>
                <label className="block text-white font-medium mb-1">Validation</label>
                <select
                  value={newMission.validationType}
                  onChange={(e) =>
                    setNewMission({ ...newMission, validationType: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-red-950 text-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-950"
                >
                  <option value="manual">Manuelle</option>
                  <option value="automatic">Automatique</option>
                </select>
              </div>

              {/* Total */}
              <div className="text-white text-lg font-semibold">
                Coût total :{" "}
                {newMission.maxExecutors && newMission.points
                  ? parseInt(newMission.maxExecutors) * parseInt(newMission.points)
                  : 0}{" "}
                points
              </div>

              {/* Boutons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl shadow hover:shadow-lg transition duration-200 w-full sm:w-auto"
                >
                  Valider
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-xl shadow hover:shadow-lg transition duration-200 w-full sm:w-auto"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// 🔁 Petits composants utilitaires pour input et select
function InputField({ label, icon, ...props }) {
  return (
    <div>
      <label className="block text-white font-medium mb-1">{label}</label>
      <div className="flex items-center rounded-xl overflow-hidden bg-red-950">
        <div className="bg-green-600 p-3">{icon}</div>
        <input
          {...props}
          className="w-full px-4 py-2 bg-transparent text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-950"
        />
      </div>
    </div>
  );
}

function SelectField({ label, icon, options, ...props }) {
  return (
    <div>
      <label className="block text-white font-medium mb-1">{label}</label>
      <div className="flex items-center rounded-xl overflow-hidden bg-red-950">
        <div className="bg-green-600 p-3">{icon}</div>
        <select
          {...props}
          className="w-full px-4 py-2 bg-red-950 text-white/80 focus:outline-none focus:ring-2 focus:ring-red-950"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
