'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Building, 
  Target, 
  Shield, 
  Award,
  Users,
  Globe,
  Sparkles,
  Star,
  Heart,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CompanyPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Arrière-plan statique */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600"></div>
      
      {/* Particules flottantes (statiques, sans animation) */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          >
            <Sparkles className="w-3 h-3 text-yellow-200 opacity-80" />
          </div>
        ))}
      </div>

      <div className="relative z-10 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/dashboard">
              <button className="group flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </button>
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <div className="relative inline-block">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">McDonald's Investa</h1>
              <div className="absolute -top-3 -right-10">
                <Building className="w-10 h-10 text-yellow-300" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-yellow-200 mt-2">
              "C'est tout ce que j'aime"
            </p>
          </div>

          {/* Company Logo */}
          <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl mb-10 border border-yellow-400/30 hover:shadow-yellow-400/40 transition-all duration-500">
            <div className="p-10 text-center">
              <div className="w-36 h-36 mx-auto bg-gradient-to-br from-red-600 via-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-extrabold text-7xl shadow-2xl mb-6">
                <img src="/logoe.png" alt='Logo McDonald' className='w-24 h-24 object-center'/>
              </div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-3 drop-shadow-md">McDonald's Investa</h2>
              <p className="text-lg text-white/80">Plateforme d'investissement innovante</p>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl mb-8 border border-red-400/30 hover:shadow-red-400/40 transition-all duration-500">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-red-400 flex items-center space-x-3 mb-6">
                <Heart className="w-8 h-8 text-red-500" />
                <span>À Propos de l'Entreprise</span>
              </h2>
              <div className="space-y-4 text-white/90 text-lg">
                <p>
                  McDonald's Investa est une plateforme d'investissement révolutionnaire qui combine la confiance 
                  de la marque McDonald's avec des opportunités d'investissement innovantes. Notre mission est de 
                  démocratiser l'accès aux investissements et de permettre à chacun de faire fructifier son capital.
                </p>
                <p>
                  Avec notre slogan "C'est tout ce que j'aime", nous nous engageons à offrir une expérience 
                  d'investissement aussi satisfaisante qu'un repas chez McDonald's : simple, accessible et 
                  toujours de qualité.
                </p>
                <p>
                  Notre plateforme propose des plans d'investissement diversifiés, un système de parrainage 
                  généreux et des micro-tâches rémunérées pour maximiser vos revenus.
                </p>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl border border-green-400/30 hover:shadow-green-400/40 transition-all duration-500 hover:scale-105">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-green-400 flex items-center space-x-3 mb-4">
                  <Target className="w-7 h-7 text-green-500" />
                  <span>Notre Mission</span>
                </h2>
                <div>
                  <p className="text-white/90">
                    Rendre l'investissement accessible à tous en proposant des solutions simples, 
                    transparentes et rentables. Nous croyons que chacun mérite l'opportunité de 
                    faire croître son patrimoine financier.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl border border-blue-400/30 hover:shadow-blue-400/40 transition-all duration-500 hover:scale-105">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-400 flex items-center space-x-3 mb-4">
                  <Globe className="w-7 h-7 text-blue-500" />
                  <span>Notre Vision</span>
                </h2>
                <div>
                  <p className="text-white/90">
                    Devenir la plateforme d'investissement de référence à Madagascar et en Afrique, 
                    en combinant innovation technologique et valeurs humaines pour créer un écosystème 
                    financier inclusif.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl mb-8 border border-yellow-400/30 hover:shadow-yellow-400/40 transition-all duration-500">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-yellow-400 flex items-center space-x-3 mb-6">
                <Star className="w-8 h-8 text-yellow-500" />
                <span>Nos Valeurs</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Shield className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Sécurité</h3>
                  <p className="text-sm text-white/80">
                    Protection maximale de vos investissements et données personnelles
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Zap className="w-10 h-10 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Innovation</h3>
                  <p className="text-sm text-white/80">
                    Technologies de pointe pour une expérience utilisateur optimale
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Users className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Communauté</h3>
                  <p className="text-sm text-white/80">
                    Création d'une communauté d'investisseurs solidaires et prospères
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl mb-8 border border-blue-400/30 hover:shadow-blue-400/40 transition-all duration-500">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-blue-400 flex items-center space-x-3 mb-6">
                <Award className="w-8 h-8 text-blue-500" />
                <span>Nos Réalisations</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-red-500 mb-2">1000+</div>
                  <p className="text-sm text-white/80">Investisseurs Actifs</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-yellow-500 mb-2">50M+</div>
                  <p className="text-sm text-white/80">Ariary Investis</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-500 mb-2">99.9%</div>
                  <p className="text-sm text-white/80">Disponibilité</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-500 mb-2">24/7</div>
                  <p className="text-sm text-white/80">Support Client</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl border border-green-400/30 hover:shadow-green-400/40 transition-all duration-500">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-green-400 text-center mb-6">Contactez-nous</h2>
              <div className="text-center space-y-4">
                <p className="text-white/90 text-lg">
                  Pour toute question ou assistance, notre équipe est à votre disposition.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button className="bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    WhatsApp: +261 34 XX XXX XX
                  </button>
                  <button className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    Email: support@mcdonald-s-investa.com
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}