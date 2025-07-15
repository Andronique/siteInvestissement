"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Coins,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// 🌟 Missions de test
const sampleMissions = [
  {
    id: "1",
    title: "Like vidéo YouTube",
    description: "Liker cette vidéo McDonald's",
    url: "https://youtube.com/watch?v=123",
    type: "like",
    points: 1,
    maxExecutors: 100,
    currentExecutors: 45,
    creatorId: "user123",
    status: "pending",
    validationType: "manual",
    createdAt: "2025-06-25T10:00:00Z",
  },
  {
    id: "2",
    title: "S'abonner à une chaîne",
    description: "S'abonner à notre chaîne gaming",
    url: "https://youtube.com/channel/abc",
    type: "subscribe",
    points: 2,
    maxExecutors: 30,
    currentExecutors: 10,
    creatorId: "user456",
    status: "pending",
    validationType: "manual",
    createdAt: "2025-06-26T08:30:00Z",
  },
];

export default function ValiderMission() {
  const [missions, setMissions] = useState(sampleMissions);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      router.push("/auth/login");
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  const handleValidateMission = (missionId) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId ? { ...m, status: "validated" } : m
      )
    );
    toast.success("Mission validée avec succès !");
  };

  const handleRejectMission = (missionId) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId ? { ...m, status: "rejected" } : m
      )
    );
    toast.error("Mission rejetée !");
  };

  return (
    <div className="min-h-screen bg-red-600 text-white relative overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600 opacity-50 z-0" />
      <div className="relative z-10 p-6 max-w-4xl mx-auto">

        {/* Retour */}
        <div className="flex justify-start mb-6">
          <Link href="/microtasks">
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-bold rounded-full hover:scale-105 transition-transform duration-200">
              <ArrowLeft className="w-6 h-6 mr-2" />
              Retour
            </button>
          </Link>
        </div>

        {/* Titre */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-red-600 bg-clip-text text-transparent drop-shadow-xl">
            VALIDER UNE MISSION
          </h1>
          <p className="text-gray-300 text-lg mt-3">Validez les missions terminées</p>
        </div>

        {/* Cartes missions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {missions.map((mission) => (
            <div key={mission.id} className="bg-red-600/80 border border-none rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-green-500 text-white text-sm font-semibold px-2 py-1 rounded-full flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Validation
                </span>
              </div>
              <div className="text-white space-y-1 text-sm">
                <p><strong>➤ Titre:</strong> {mission.title}</p>
                <p><strong>➤ Type:</strong> {mission.type}</p>
                <p><strong>➤ Points:</strong> {mission.points}</p>
                <p><strong>➤ Statut:</strong> {mission.status}</p>
              </div>
              <p className="text-white text-sm mt-2">{mission.description}</p>
              <a
                href={mission.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-300 mt-2 underline text-sm"
              >
                Voir le lien
              </a>

              {/* Boutons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleValidateMission(mission.id)}
                  className="w-1/2 bg-blue-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
                >
                  Valider
                </button>
                <button
                  onClick={() => handleRejectMission(mission.id)}
                  className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
                >
                  Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
