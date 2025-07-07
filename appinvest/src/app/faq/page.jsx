'use client';

import { useState, useEffect } from 'react';
import {
  FaArrowLeft,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
  FaCommentAlt,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FAQ_DATA = [
  {
    id: '1',
    question: 'Comment créer un compte ?',
    answer: 'Allez sur le site www.mcdonald-s-investa.com...',
    category: 'Compte',
  },
  {
    id: '2',
    question: 'Comment faire un dépôt ?',
    answer:
      'Avant d\'acheter un plan, vous devez alimenter votre compte. Option 1: Mobile Money - Cliquez sur "Déposer", sélectionnez votre opérateur (MVola, Airtel, Orange), entrez le montant, envoyez l\'argent au numéro affiché, prenez une capture d\'écran, téléversez la preuve. Option 2: USDT TRC20 - Sélectionnez "Crypto USDT", copiez l\'adresse, envoyez depuis votre wallet, téléversez la capture.',
    category: 'Dépôt',
  },
  {
    id: '3',
    question: 'Comment acheter un plan d\'investissement ?',
    answer:
      'Une fois votre solde crédité, allez dans "Plans d\'investissement". Parcourez les offres BURGER 1 à 7. Choisissez votre plan selon votre budget. Entrez le montant à investir. Cliquez sur "Investir". Vous verrez votre plan actif dans votre tableau de bord.',
    category: 'Investissement',
  },
  {
    id: '4',
    question: 'Comment demander un retrait ?',
    answer:
      'Allez dans "Retraits". Sélectionnez la méthode (Mobile Money ou USDT TRC20). Entrez votre numéro/adresse et le montant. Saisissez votre mot de passe de retrait. Cliquez sur "Soumettre". Minimum: 4800 Ar ou 1 USDT. Frais: 10%. Validation manuelle sous 12h.',
    category: 'Retrait',
  },
  {
    id: '5',
    question: 'Comment fonctionne le parrainage ?',
    answer:
      'Votre lien de parrainage est généré automatiquement avec votre USER ID. Partagez-le pour inviter de nouveaux membres. Vous recevez 10% de commission sur leurs investissements directs. Commissions d\'équipe: Niveau 1: 6%, Niveau 2: 3%, Niveau 3: 1% des gains journaliers.',
    category: 'Parrainage',
  },
  {
    id: '6',
    question: 'Qu\'est-ce que les micro-tâches ?',
    answer:
      'Les micro-tâches sont des missions rémunérées en points (likes, abonnements, etc.). Achetez des points (1 point = 100 Ar pour investisseurs, 10 Ar pour non-investisseurs). Créez des missions ou exécutez celles des autres. Timer minimum 15 secondes. Validation avec capture d\'écran.',
    category: 'Micro-tâches',
  },
  {
    id: '7',
    question: 'Quels sont les plans d\'investissement disponibles ?',
    answer:
      'BURGER 1: 10K-400K Ar (3%/jour), BURGER 2: 405K-1.2M Ar (3.5%/jour), BURGER 3: 1.205M-2.5M Ar (4%/jour), BURGER 4: 2.505M-3.75M Ar (4.5%/jour), BURGER 5: 3.755M-5M Ar (4.75%/jour), BURGER 6: 5.005M-7.5M Ar (5%/jour), BURGER 7: 7.505M-10M Ar (5.5%/jour).',
    category: 'Investissement',
  },
  {
    id: '8',
    question: 'Comment suivre mes transactions ?',
    answer:
      'Historique des dépôts: section "Mes Dépôts". Historique des retraits: section "Mes Retraits". Plans actifs & revenus: Tableau de bord. Toutes les transactions sont visibles dans "Historique de transaction" avec filtres par catégorie.',
    category: 'Transactions',
  },
];

const CATEGORIES = [
  'Tous',
  'Compte',
  'Dépôt',
  'Retrait',
  'Investissement',
  'Parrainage',
  'Micro-tâches',
  'Transactions',
];

export default function FAQPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [expandedItems, setExpandedItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  const filteredFAQ = FAQ_DATA.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600"></div>

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/dashboard">
              <button className="group flex items-center px-4 py-2 bg-gradient-to-r
               from-red-500 to-yellow-500 text-white font-semibold
               rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </button>
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold text-emerald-400 glow">FAQ</h1>
              <div className="absolute -top-2 -right-8">
                <FaQuestionCircle className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <p className="text-white/80 text-lg mt-2">Foire Aux Questions</p>
          </div>

          {/* Search Bar */}
          <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg mb-6">
            <div className="relative p-4">
              <FaSearch className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans la FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-3 py-2 bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg mb-6">
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1 rounded-md font-medium text-sm transition-colors duration-300 bg-amber-700 ${
                      selectedCategory === category
                        ? 'bg-emerald-600 text-white'
                        : 'border border-emerald-500/30 text-white hover:bg-emerald-600/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4 mb-8">
            {filteredFAQ.map((item) => (
              <div
                key={item.id}
                className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg"
              >
                <div
                  className="cursor-pointer flex justify-between items-center p-4"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <div className="flex items-center text-white font-semibold">
                    <FaCommentAlt className="mr-2 w-5 h-5" />
                    <span>{item.question}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    {expandedItems.includes(item.id) ? (
                      <FaChevronUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <FaChevronDown className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                </div>
                {expandedItems.includes(item.id) && (
                  <div className="p-4 text-white/90 text-sm">{item.answer}</div>
                )}
              </div>
            ))}
            {filteredFAQ.length === 0 && (
              <div className="text-center py-8">
                <FaQuestionCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Aucune question trouvée pour cette recherche ou catégorie.</p>
              </div>
            )}
          </div>

          {/* Support Section */}
          <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg">
            <div className="p-6">
              <h2 className="text-emerald-400 text-center text-xl font-semibold mb-4">
                Besoin d'aide supplémentaire ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300">
                  <FaPhone className="w-4 h-4 mr-2 inline" />
                  WhatsApp Support
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300">
                  <FaEnvelope className="w-4 h-4 mr-2 inline" />
                  Email Support
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300">
                  <FaCommentAlt className="w-4 h-4 mr-2 inline" />
                  Chat en Direct
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Padding */}
          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}