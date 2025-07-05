'use client';

import { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
  FaMagic,
  FaCommentAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FAQ_DATA = [
  {
    id: "1",
    question: "Comment créer un compte ?",
    answer:
      "Allez sur le site www.mcdonald-s-investa.com...",
    category: "Compte",
  },
  {
    id: '2',
    question: 'Comment faire un dépôt ?',
    answer: 'Avant d\'acheter un plan, vous devez alimenter votre compte. Option 1: Mobile Money - Cliquez sur "Déposer", sélectionnez votre opérateur (MVola, Airtel, Orange), entrez le montant, envoyez l\'argent au numéro affiché, prenez une capture d\'écran, téléversez la preuve. Option 2: USDT TRC20 - Sélectionnez "Crypto USDT", copiez l\'adresse, envoyez depuis votre wallet, téléversez la capture.',
    category: 'Dépôt'
  },
  {
    id: '3',
    question: 'Comment acheter un plan d\'investissement ?',
    answer: 'Une fois votre solde crédité, allez dans "Plans d\'investissement". Parcourez les offres BURGER 1 à 7. Choisissez votre plan selon votre budget. Entrez le montant à investir. Cliquez sur "Investir". Vous verrez votre plan actif dans votre tableau de bord.',
    category: 'Investissement'
  },
  {
    id: '4',
    question: 'Comment demander un retrait ?',
    answer: 'Allez dans "Retraits". Sélectionnez la méthode (Mobile Money ou USDT TRC20). Entrez votre numéro/adresse et le montant. Saisissez votre mot de passe de retrait. Cliquez sur "Soumettre". Minimum: 4800 Ar ou 1 USDT. Frais: 10%. Validation manuelle sous 12h.',
    category: 'Retrait'
  },
  {
    id: '5',
    question: 'Comment fonctionne le parrainage ?',
    answer: 'Votre lien de parrainage est généré automatiquement avec votre USER ID. Partagez-le pour inviter de nouveaux membres. Vous recevez 10% de commission sur leurs investissements directs. Commissions d\'équipe: Niveau 1: 6%, Niveau 2: 3%, Niveau 3: 1% des gains journaliers.',
    category: 'Parrainage'
  },
  {
    id: '6',
    question: 'Qu\'est-ce que les micro-tâches ?',
    answer: 'Les micro-tâches sont des missions rémunérées en points (likes, abonnements, etc.). Achetez des points (1 point = 100 Ar pour investisseurs, 10 Ar pour non-investisseurs). Créez des missions ou exécutez celles des autres. Timer minimum 15 secondes. Validation avec capture d\'écran.',
    category: 'Micro-tâches'
  },
  {
    id: '7',
    question: 'Quels sont les plans d\'investissement disponibles ?',
    answer: 'BURGER 1: 10K-400K Ar (3%/jour), BURGER 2: 405K-1.2M Ar (3.5%/jour), BURGER 3: 1.205M-2.5M Ar (4%/jour), BURGER 4: 2.505M-3.75M Ar (4.5%/jour), BURGER 5: 3.755M-5M Ar (4.75%/jour), BURGER 6: 5.005M-7.5M Ar (5%/jour), BURGER 7: 7.505M-10M Ar (5.5%/jour).',
    category: 'Investissement'
  },
  {
    id: '8',
    question: 'Comment suivre mes transactions ?',
    answer: 'Historique des dépôts: section "Mes Dépôts". Historique des retraits: section "Mes Retraits". Plans actifs & revenus: Tableau de bord. Toutes les transactions sont visibles dans "Historique de transaction" avec filtres par catégorie.',
    category: 'Transactions'
  }
];

const CATEGORIES = [
  "Tous",
  "Compte",
  "Dépôt",
  "Retrait",
  "Investissement",
  "Parrainage",
  "Micro-tâches",
  "Transactions",
];

export default function FAQPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [expandedItems, setExpandedItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      router.push("/auth/login");
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  const filteredFAQ = FAQ_DATA.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tous" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-400 to-red-600"></div>

      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <FaMagic className="w-2 h-2 text-yellow-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard">
              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <FaArrowLeft className="w-4 h-4 mr-2" /> Retour
              </button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">FAQ</h1>
              <div className="absolute -top-2 -right-8">
                <FaQuestionCircle className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <p className="text-white/80 text-lg">Foire Aux Questions</p>
          </div>

          <div className="bg-red-400 shadow-2xl rounded p-4 mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans la FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full  rounded px-3 py-2 bg-amber-50"
              />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl p-4 mb-6 border border-red-400/30 hover:shadow-red-400/40 transition-all duration-500">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1 rounded-full font-semibold text-sm bg-red-200 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                      : 'border border-red-400/50 text-red-500 hover:bg-red-400/10'
                  } shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {filteredFAQ.map((item) => (
              <div key={item.id} className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl p-4 border border-red-400/30 hover:shadow-red-400/40 transition-all duration-500">
                <div
                  className="cursor-pointer flex justify-between items-center"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <div className="flex items-center text-red-500 font-semibold">
                    <FaCommentAlt className="mr-2 w-5 h-5" />
                    {item.question}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    {expandedItems.includes(item.id) ? (
                      <FaChevronUp className="w-4 h-4 text-red-500" />
                    ) : (
                      <FaChevronDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                {expandedItems.includes(item.id) && (
                  <div className="mt-2 text-white/90">{item.answer}</div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl p-4 border border-red-400/30 hover:shadow-red-400/40 transition-all duration-500">
            <h2 className="text-red-500 text-center text-xl font-semibold mb-4">
              Besoin d'aide supplémentaire ?
            </h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center">
                <FaPhone className="mr-2" /> WhatsApp Support
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center">
                <FaEnvelope className="mr-2" /> Email Support
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded flex items-center justify-center">
                <FaCommentAlt className="mr-2" /> Chat en Direct
              </button>
            </div>
          </div>
          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}