import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, MapPin, Lock, Users, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/images/1logoamnafi.png" alt="AMNAFI" className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">AMNAFI</span>
            </div>
            <Link to="/" className="flex items-center text-orange-600 hover:text-orange-700 transition">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-orange-600 to-red-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield className="w-20 h-20 mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl font-bold mb-4">Politique de Confidentialité</h1>
          <p className="text-orange-100 text-xl">Votre vie privée est notre priorité</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-16 space-y-12">
          
          <section>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">INTRODUCTION</h2>
                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                  La présente Politique de Confidentialité a pour objectif d'informer les utilisateurs de l'application <span className="font-semibold text-orange-600">AMNAFI</span> sur la manière dont leurs données personnelles sont collectées, utilisées, stockées, protégées et partagées.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                  AMNAFI est une plateforme numérique permettant la mise en relation entre :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-6 text-lg">
                  <li>Des clients recherchant des services</li>
                  <li>Des prestataires indépendants proposant leurs compétences</li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-lg mt-4">
                  En utilisant l'Application, l'Utilisateur reconnaît avoir pris connaissance de la présente Politique et l'accepter sans réserve.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">IDENTITÉ DE L'ÉDITEUR</h2>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-8 rounded-r-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Nom / Marque</p>
                        <p className="font-bold text-gray-900 text-xl">AMNAFI</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Localisation</p>
                        <p className="font-semibold text-gray-900 text-lg">Dakar, Sénégal</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-6 h-6 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Email de contact</p>
                        <p className="font-semibold text-gray-900 text-lg">amnaficontact@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">CADRE LÉGAL APPLICABLE</h2>
                <p className="text-gray-700 text-lg mb-4">AMNAFI s'engage à respecter :</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-800">La Loi n° 2008-12 du 25 janvier 2008 relative à la protection des données à caractère personnel au Sénégal</p>
                  </div>
                  <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-800">Les recommandations de la Commission de Protection des Données Personnelles (CDP)</p>
                  </div>
                  <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-800">Les principes internationaux reconnus en matière de protection de la vie privée</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">4</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">DONNÉES PERSONNELLES COLLECTÉES</h2>
                
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">4.1 Données d'identification</h3>
                <ul className="grid md:grid-cols-2 gap-3 mb-6">
                  <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"><span className="text-orange-600">•</span> Nom et prénom</li>
                  <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"><span className="text-orange-600">•</span> Numéro de téléphone</li>
                  <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"><span className="text-orange-600">•</span> Adresse email</li>
                  <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"><span className="text-orange-600">•</span> Photo de profil</li>
                </ul>

                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl mt-8">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-red-900 font-bold text-lg mb-3">⚠️ AMNAFI ne stocke JAMAIS :</p>
                      <ul className="space-y-2 text-red-800">
                        <li className="flex items-center gap-2"><Lock className="w-4 h-4" /> Codes PIN</li>
                        <li className="flex items-center gap-2"><Lock className="w-4 h-4" /> Numéros de carte bancaire</li>
                        <li className="flex items-center gap-2"><Lock className="w-4 h-4" /> Identifiants de paiement mobile</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">5</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">CONDITIONS D'ACCÈS - ÂGE MINIMUM</h2>
                <div className="bg-red-50 border-4 border-red-400 p-8 rounded-2xl mb-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-12 h-12 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-red-900 font-bold text-2xl mb-4">⚠️ RESTRICTION D'ÂGE</p>
                      <p className="text-red-800 text-lg mb-4">
                        L'utilisation de la plateforme AMNAFI est <span className="font-bold">STRICTEMENT RÉSERVÉE aux personnes âgées de 18 ans et plus</span>.
                      </p>
                      <p className="text-red-900 font-bold mt-4 text-lg">
                        En créant un compte, vous certifiez sur l'honneur être majeur(e) et avoir la capacité juridique d'accepter les présentes conditions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">6</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">CONTACT</h2>
                <div className="bg-gradient-to-r from-orange-100 to-red-100 border-4 border-orange-300 p-8 rounded-2xl">
                  <p className="text-gray-900 font-bold mb-6 text-xl">Pour toute question relative à la protection des données :</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl">
                      <Mail className="w-8 h-8 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-lg font-semibold text-gray-900">amnaficontact@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl">
                      <MapPin className="w-8 h-8 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Localisation</p>
                        <p className="text-lg font-semibold text-gray-900">Dakar, Sénégal</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center pt-12 border-t-2 border-orange-100">
            <p className="text-gray-500 text-sm mb-2">Dernière mise à jour : Février 2026</p>
            <p className="text-gray-400 text-xs">© 2026 AMNAFI - Tous droits réservés</p>
          </div>
        </div>
      </div>
    </div>
  );
}
