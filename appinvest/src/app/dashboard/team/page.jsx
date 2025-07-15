'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Copy, Share2, Info, TrendingUp, Gift, MessageCircle, Crown, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const SAMPLE_TEAM = [
  {
    id: '1',
    name: 'User123',
    level: 1,
    joinDate: '2025-06-20',
    isInvestor: true,
    totalInvested: 150000,
    directReferrals: 3,
  },
  {
    id: '2',
    name: 'User456',
    level: 1,
    joinDate: '2025-06-22',
    isInvestor: true,
    totalInvested: 75000,
    directReferrals: 1,
  },
  {
    id: '3',
    name: 'User789',
    level: 2,
    joinDate: '2025-06-23',
    isInvestor: false,
    totalInvested: 0,
    directReferrals: 0,
  },
];

export default function TeamPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeLevel, setActiveLevel] = useState(1);
  const [userStats] = useState({
    totalReferrals: 25,
    activeInvestors: 18,
    referralCode: 'USR_123456',
    referralLink: 'https://mcdonald-s-investa.com/auth/register?ref=USR_123456',
  });
  const [team] = useState(SAMPLE_TEAM);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copié !`);
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Rejoignez McDonald's Investa",
        text: "Investissez avec moi sur McDonald's Investa et gagnez de l'argent !",
        url: userStats.referralLink,
      });
    } else {
      copyToClipboard(userStats.referralLink, 'Lien de parrainage');
    }
  };

  const filteredTeam = team.filter((member) => member.level === activeLevel);

  return (
    <div className="min-h-screen relative overflow-hidden ">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600"></div>

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/dashboard">
              <button className="group flex items-center px-4 py-2 bg-gradient-to-r
               from-red-500 to-yellow-500 text-white font-semibold rounded-full 
               shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </button>
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold text-emerald-800 glow">ÉQUIPE & GROUPE</h1>
              <div className="absolute -top-2 -right-8">
                <Users className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <p className="text-white/80 text-lg mt-2">Votre réseau de parrainage</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg bg-red-500">
              <div className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-emerald-400 text-sm">Inscrits</p>
                <p className="text-2xl font-bold text-white">{userStats.totalReferrals}</p>
              </div>
            </div>
            <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg bg-red-500">
              <div className="p-4 text-center">
                <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-emerald-400 text-sm">Équipe</p>
                <p className="text-2xl font-bold text-white">{userStats.activeInvestors}</p>
              </div>
            </div>
          </div>

          {/* Referral Links */}
          <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg mb-6 bg-red-500">
            <div className="p-6">
              <h2 className="text-emerald-400 flex items-center space-x-2 text-lg font-semibold mb-4">
                <Share2 className="w-6 h-6" />
                <span>Mes Liens de Parrainage</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Lien d'invitation</label>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-emerald-900/20 p-3 rounded-lg">
                      <p className="text-white text-sm font-mono break-all">{userStats.referralLink}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(userStats.referralLink, 'Lien')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Code d'invitation</label>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-emerald-900/20 p-3 rounded-lg">
                      <p className="text-white text-lg font-bold font-mono">{userStats.referralCode}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(userStats.referralCode, 'Code')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={shareReferralLink}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                >
                  <Share2 className="w-4 h-4 mr-2 inline" />
                  Partager mon lien
                </button>
              </div>
            </div>
          </div>

          {/* Commissions */}
          <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg mb-6 bg-red-500">
            <div className="p-6">
              <h2 className="text-emerald-400 flex items-center space-x-2 text-lg font-semibold mb-4">
                <Info className="w-6 h-6" />
                <span>Commissions</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-yellow-400" />
                    <span>Commission de Parrainage</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-100">Niveau 1:</span>
                      <span className="text-emerald-900 font-semibold">10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-100">Niveau 2:</span>
                      <span className="text-emerald-900 font-semibold">6%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-100">Niveau 3:</span>
                      <span className="text-emerald-900 font-semibold">3%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span>Commission d'Équipe</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-100">Niveau 1:</span>
                      <span className="text-emerald-900 font-semibold">6% des gains</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-100">Niveau 2:</span>
                      <span className="text-emerald-900 font-semibold">3% des gains</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-100">Niveau 3:</span>
                      <span className="text-emerald-900 font-semibold">1% des gains</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg mb-6 bg-red-500">
            <div className="p-6">
              <h2 className="text-emerald-800 text-lg font-semibold mb-4">Mon Équipe</h2>
              <div className="flex justify-center space-x-2 mb-6">
                {[1, 2, 3].map((level) => (
                  <button
                    key={level}
                    onClick={() => setActiveLevel(level)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-300 bg-amber-800 ${
                      activeLevel === level
                        ? 'bg-emerald-600 text-white'
                        : 'border border-emerald-500/30 text-white hover:bg-emerald-600/20'
                    }`}
                  >
                    Niveau {level}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                {filteredTeam.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-emerald-900/20 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{member.name}</p>
                        <p className="text-sm text-gray-400">
                          Inscrit le {new Date(member.joinDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {member.isInvestor && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          <Star className="w-3 h-3 mr-1 inline" />
                          Investisseur
                        </span>
                      )}
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        L{member.level}
                      </span>
                    </div>
                  </div>
                ))}
                /

                {filteredTeam.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Aucun membre au niveau {activeLevel}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Official Group */}
          <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg bg-red-500">
            <div className="p-6">
              <h2 className="text-emerald-800 flex items-center space-x-2 text-lg font-semibold mb-4">
                <MessageCircle className="w-6 h-6" />
                <span>Groupe Officiel</span>
              </h2>
              <div className="text-center">
                <p className="text-white mb-4">
                  Rejoignez notre groupe WhatsApp officiel pour rester informé des dernières actualités et échanger avec la communauté.
                </p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300">
                  <MessageCircle className="w-4 h-4 mr-2 inline" />
                  Rejoindre le Groupe Officiel
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