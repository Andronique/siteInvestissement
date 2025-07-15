"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Play } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SAMPLE_MISSIONS = [
  {
    id: "1",
    title: "Test",
    description: "Description Test",
    url: "https://www.google.com/",
    type: "like",
    points: 10,
    maxExecutors: 100,
    currentExecutors: 45,
    creatorId: "user123",
    status: "active",
    validationType: "manual",
    createdAt: "2025-06-25T10:00:00Z",
  },
];

export default function ExecuterMission({
  userPoints = 0,
  setUserPoints = () => {},
  missions = SAMPLE_MISSIONS,
  setMissions = () => {},
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [missionsPerPage] = useState(5);
  const [activeExecutionId, setActiveExecutionId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [screenshot, setScreenshot] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      router.push("/auth/login");
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  const indexOfLastMission = currentPage * missionsPerPage;
  const indexOfFirstMission = indexOfLastMission - missionsPerPage;
  const currentMissions = missions.slice(indexOfFirstMission, indexOfLastMission);

  const getTypeLabel = (type) => {
    const types = {
      like: "Like",
      subscribe: "S'abonner",
      watch: "Regarder",
      follow: "Suivre",
      register: "S'inscrire",
    };
    return types[type] || type;
  };

  const handleExecuteMission = (missionId) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission || mission.currentExecutors >= mission.maxExecutors) {
      toast.error("Cette mission n'est plus disponible ou est complète.");
      return;
    }

    setSelectedMission(mission);
    setTimer(15);
    setIsExecuting(true);
    setActiveExecutionId(missionId);

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
    }
  };

  const handleValidateMission = () => {
    if (!screenshot) {
      toast.error("Veuillez téléverser une capture d'écran.");
      return;
    }

    setUserPoints((prev) => prev + selectedMission.points);
    setMissions((prevMjetosissions) =>
      prevMissions.map((m) =>
        m.id === selectedMission.id
          ? { ...m, currentExecutors: m.currentExecutors + 1 }
          : m
      )
    );

   

    toast.success(
      `Mission "${selectedMission.title}" validée ! +${selectedMission.points} points.`
    );
    setSelectedMission(null);
    setIsExecuting(false);
    setScreenshot(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-600 to-red-500 text-white relative overflow-x-hidden flex justify-center">
      <div className="absolute inset-0 bg-opacity-60 z-0" />
      <div className="relative z-10 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        {/* Retour */}
        <div className="flex justify-start items-center mb-6 sm:mb-8">
          <Link href="/microtasks">
            <button className="group flex items-center px-4 py-2 sm:px-5 sm:py-3 bg-gradient-to-r from-red-500 to-yellow-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
              <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
              Retour
            </button>
          </Link>
        </div>

        {/* Titre */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl">
            EXÉCUTER UNE MISSION
          </h1>
          <p className="text-gray-200 text-base sm:text-lg mt-2">
            Exécutez vos missions et gagnez des points
          </p>
        </div>

        {/* Interface d’exécution */}
        {selectedMission ? (
          <div className="bg-white text-gray-900 rounded-xl shadow-lg p-4 max-w-md mx-auto">
            <h2 className="text-center text-xl font-semibold text-red-600 mb-4">
              🚀 Exécution de la mission<br />{selectedMission.title}
            </h2>
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4 text-center">
              ⚠️ Faire la tâche pendant 15 sec puis clique sur <strong>"Valider"</strong>
            </div>
            <p className="text-center text-lg mb-2">
              Temps restant: <strong>{timer}s</strong>
            </p>
            <div className="mb-2 flex items-center gap-2">
              ✅ <span className="text-sm">Lien: <a href={selectedMission.url} target="_blank" className="text-blue-600 underline">{selectedMission.url}</a></span>
            </div>
            <div className="mb-4 flex items-center gap-2">
              ✅ <span className="text-sm">Description: <strong>{selectedMission.description}</strong></span>
            </div>
            <div className="mb-4 border border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
              📷
              <input
                type="file"
                accept="image/*"
                onChange={handleScreenshotUpload}
                className="mt-2 block w-full text-sm text-gray-500"
              />
              <p className="text-sm text-gray-500 mt-2">Téléverser votre capture d’écran ici</p>
            </div>
            <button
              className={`w-full py-2 rounded-lg text-white font-bold ${timer === 0 ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
              disabled={timer > 0}
              onClick={handleValidateMission}
            >
              Valider
            </button>
          </div>
        ) : (
        <div className="flex justify-center min-h-[20vh] px-4 sm:px-42 md:px-100">
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            {currentMissions.map((mission) => (
              <div
                key={mission.id}
                className="bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 p-4 flex flex-col justify-between w-72"
              >
                <div>
                  <div className="text-red-600 font-bold mb-2 flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Exécuter des missions
                  </div>
                  <p className="text-sm mb-1">
                    <strong>➤ Titre de la mission:</strong> {mission.title}
                  </p>
                  <p className="text-sm mb-1">
                    <strong>➤ Type de mission:</strong> {getTypeLabel(mission.type)}
                  </p>
                  <p className="text-sm mb-3">
                    <strong>➤ Points à gagner:</strong> {mission.points}
                  </p>
                </div>
                <button
                  className="mt-auto bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                  onClick={() => handleExecuteMission(mission.id)}
                >
                  Exécuter
                </button>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}