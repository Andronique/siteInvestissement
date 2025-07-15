"use client";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Play,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
 // Assurez-vous que ce chemin est correct et que l'image existe

const SAMPLE_MISSIONS = [
  {
    id: "1",
    title: "Like vidéo YouTube",
    description: "Liker cette vidéo YouTube sur les burgers McDonald's",
    url: "https://youtube.com/watch?v=example",
    type: "like",
    points: 1,
    maxExecutors: 100,
    currentExecutors: 45,
  },
  {
    id: "2",
    title: "S'abonner à la chaîne",
    description: "S'abonner à notre chaîne YouTube officielle",
    url: "https://youtube.com/channel/example",
    type: "subscribe",
    points: 2,
    maxExecutors: 50,
    currentExecutors: 12,
  },
];

export default function MicrotasksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const missionsPerPage = 5;
  const totalPages = Math.ceil(SAMPLE_MISSIONS.length / missionsPerPage);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-600 to-red-800 text-white overflow-x-hidden font-sans">
      <div className="relative z-10 p-4 sm:p-6 max-w-5xl mx-auto">
        <div className="flex justify-start items-center mb-6">
          <Link href="/dashboard">
            <button className="group flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-300">
              <ArrowLeft className="w-6 h-6 mr-2" />
              Retour
            </button>
          </Link>
        </div>

        {/* Titre */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 drop-shadow-md">
            Micro-taches
          </h1>
          <p className="text-white/80 mt-2 text-base sm:text-lg">
            gagner des pointes
          </p>
        </div>

        {/* Onglets */}
        <div className="mb-8 flex justify-center space-x-4">
          <Link href="/microtasks/creerMission">
            <div className="flex items-center px-5 py-3 rounded-full font-semibold text-white bg-amber-400">
              <Plus className="w-6 h-6 mr-2" />
              Créer
            </div>
          </Link>
          <Link href="/microtasks/executerMission">
            <div className="flex items-center px-5 py-3 rounded-full font-semibold text-white bg-amber-600">
              <Play className="w-6 h-6 mr-2" />
              Exécuter
            </div>
          </Link>
          <Link href="/microtasks/validerMission">
            <div className="flex items-center px-5 py-3 rounded-full font-semibold text-white bg-amber-700">
              <CheckCircle className="w-6 h-6 mr-2" />
              Valider
            </div>
          </Link>
        </div>

        {/* Liste des missions */}
        <div className="bg-white/90 border border-gray-300 rounded-xl p-4 mb-5 overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-800">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Mission</th>
                <th className="p-2">Type</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_MISSIONS.map((m, index) => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{m.title}</td>
                  <td className="p-2">{getTypeLabel(m.type)}</td>
                  <td className="p-2 text-green-600 font-medium">Actif</td>
                  <td className="p-2">10/07/2025</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-xs text-gray-500 mt-3">
            Affichage de 1 à {SAMPLE_MISSIONS.length} sur {SAMPLE_MISSIONS.length} entrées
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded bg-white/20 text-white hover:bg-white/30 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded bg-white/20 text-white hover:bg-white/30 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
