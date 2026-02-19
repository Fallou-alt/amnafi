'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Shield, Mail, MapPin, Lock, Eye, Users, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image src="/images/1logoamnafi.png" alt="AMNAFI" width={40} height={40} className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">AMNAFI</span>
            </div>
            <Link href="/" className="flex items-center text-orange-600 hover:text-orange-700 transition">
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
          
          {/* Section 1 */}
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

          {/* Section 2 */}
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

          {/* Section 3 */}
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

          {/* Section 4 */}
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

                <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">4.2 Données professionnelles (prestataires)</h3>
                <ul className="grid md:grid-cols-2 gap-3 mb-6">
                  <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"><span className="text-orange-600">•</span> Métier / catégorie</li>
                  <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"><span className="text-orange-600">•</span> Compétences</li>
                  <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"><span className="text-orange-600">•</span> Années d'expérience</li>
                  <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"><span className="text-orange-600">•</span> Portfolio</li>
                  <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"><span className="text-orange-600">•</span> Tarifs indicatifs</li>
                  <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"><span className="text-orange-600">•</span> Documents justificatifs</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">4.3 Données de localisation</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"><span className="text-orange-600">•</span> Ville / zone géographique</li>
                  <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"><span className="text-orange-600">•</span> Géolocalisation en temps réel (avec consentement)</li>
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

          {/* Section 5 */}
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
                      <div className="bg-white p-6 rounded-xl mt-4">
                        <p className="text-gray-900 font-semibold mb-3 text-lg">Les mineurs (moins de 18 ans) :</p>
                        <ul className="space-y-2 text-gray-800">
                          <li className="flex items-center gap-2"><span className="text-red-600 font-bold text-xl">×</span> Ne peuvent PAS créer de compte</li>
                          <li className="flex items-center gap-2"><span className="text-red-600 font-bold text-xl">×</span> Ne peuvent PAS s'inscrire comme prestataires</li>
                          <li className="flex items-center gap-2"><span className="text-red-600 font-bold text-xl">×</span> Ne peuvent PAS utiliser les services de la plateforme</li>
                          <li className="flex items-center gap-2"><span className="text-red-600 font-bold text-xl">×</span> Ne peuvent PAS effectuer de transactions</li>
                        </ul>
                      </div>
                      <p className="text-red-900 font-bold mt-4 text-lg">
                        En créant un compte, vous certifiez sur l'honneur être majeur(e) et avoir la capacité juridique d'accepter les présentes conditions.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-2xl">
                  <p className="text-yellow-900 font-semibold text-lg mb-3">Vérification de l'âge :</p>
                  <p className="text-yellow-800">
                    AMNAFI se réserve le droit de demander une pièce d'identité pour vérifier l'âge de tout utilisateur. Tout compte créé par un mineur sera immédiatement supprimé sans préavis.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">6</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">FINALITÉS DU TRAITEMENT</h2>
                <p className="text-gray-700 text-lg mb-4">Les données personnelles sont collectées afin de :</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                    <p className="text-gray-800">✓ Créer et gérer les comptes</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                    <p className="text-gray-800">✓ Mise en relation clients/prestataires</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                    <p className="text-gray-800">✓ Afficher les profils et services</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                    <p className="text-gray-800">✓ Géolocalisation des prestataires</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                    <p className="text-gray-800">✓ Gérer les abonnements Premium</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                    <p className="text-gray-800">✓ Assurer la sécurité</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                    <p className="text-gray-800">✓ Prévenir la fraude</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                    <p className="text-gray-800">✓ Améliorer nos services</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">7</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">PAIEMENTS ET SERVICES TIERS</h2>
                <p className="text-gray-700 text-lg mb-6">Les paiements sont traités exclusivement par des prestataires agréés :</p>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-yellow-50 p-4 rounded-xl text-center border-2 border-yellow-200">
                    <p className="font-bold text-gray-900">Wave</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-xl text-center border-2 border-yellow-200">
                    <p className="font-bold text-gray-900">Orange Money</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-xl text-center border-2 border-yellow-200">
                    <p className="font-bold text-gray-900">PayDunya</p>
                  </div>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                  <p className="text-blue-900 font-semibold mb-3">AMNAFI :</p>
                  <ul className="space-y-2 text-blue-800">
                    <li>✓ Ne conserve aucune donnée bancaire sensible</li>
                    <li>✓ N'intervient pas dans la gestion des fonds</li>
                    <li>✓ Décline toute responsabilité liée aux services de paiement tiers</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">8</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">RESPONSABILITÉ ET LIMITATION</h2>
                <p className="text-gray-700 text-lg mb-6">
                  AMNAFI agit uniquement comme une <span className="font-semibold text-orange-600">plateforme de mise en relation</span>. Les prestataires sont des professionnels indépendants.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-2xl">
                  <p className="text-yellow-900 font-bold text-lg mb-4">AMNAFI n'est PAS responsable :</p>
                  <ul className="space-y-3 text-yellow-800">
                    <li className="flex items-start gap-2"><span className="text-yellow-600 font-bold">×</span> Des prestations réalisées entre utilisateurs</li>
                    <li className="flex items-start gap-2"><span className="text-yellow-600 font-bold">×</span> Des dommages causés par un prestataire</li>
                    <li className="flex items-start gap-2"><span className="text-yellow-600 font-bold">×</span> Des litiges, retards ou fraudes</li>
                    <li className="flex items-start gap-2"><span className="text-yellow-600 font-bold">×</span> Du comportement des utilisateurs</li>
                  </ul>
                  <p className="text-yellow-900 font-semibold mt-4">Chaque utilisateur est seul responsable de ses actes.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">9</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">DURÉE DE CONSERVATION DES DONNÉES</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                    <p className="font-semibold text-blue-900 mb-2">Comptes actifs :</p>
                    <p className="text-blue-800">Les données sont conservées tant que le compte est actif</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                    <p className="font-semibold text-blue-900 mb-2">Comptes inactifs :</p>
                    <p className="text-blue-800">Suppression automatique après 3 ans d'inactivité</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                    <p className="font-semibold text-blue-900 mb-2">Suppression de compte :</p>
                    <p className="text-blue-800">Données supprimées sous 30 jours (sauf obligations légales)</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                    <p className="font-semibold text-blue-900 mb-2">Données de facturation :</p>
                    <p className="text-blue-800">Conservées 10 ans conformément aux obligations comptables</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">10</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">PARTAGE ET DIVULGATION DES DONNÉES</h2>
                <p className="text-gray-700 text-lg mb-6">AMNAFI ne vend JAMAIS vos données personnelles. Vos données peuvent être partagées uniquement dans les cas suivants :</p>
                <div className="space-y-4">
                  <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                    <p className="font-semibold text-green-900 mb-2">✓ Entre utilisateurs :</p>
                    <p className="text-green-800">Informations de profil visibles publiquement (nom, métier, ville, téléphone)</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                    <p className="font-semibold text-green-900 mb-2">✓ Prestataires de paiement :</p>
                    <p className="text-green-800">Données nécessaires au traitement des transactions (Wave, Orange Money, PayDunya)</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                    <p className="font-semibold text-green-900 mb-2">✓ Autorités légales :</p>
                    <p className="text-green-800">Sur réquisition judiciaire ou demande des autorités compétentes</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                    <p className="font-semibold text-green-900 mb-2">✓ Prestataires techniques :</p>
                    <p className="text-green-800">Hébergement, maintenance (sous contrat de confidentialité strict)</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 11 */}
          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">11</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">COOKIES ET TECHNOLOGIES SIMILAIRES</h2>
                <p className="text-gray-700 text-lg mb-6">AMNAFI utilise des cookies pour améliorer votre expérience :</p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                    <p className="font-semibold text-purple-900 mb-2">Cookies essentiels</p>
                    <p className="text-purple-800 text-sm">Authentification, sécurité (obligatoires)</p>
                  </div>
                  <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                    <p className="font-semibold text-purple-900 mb-2">Cookies de performance</p>
                    <p className="text-purple-800 text-sm">Analyse d'utilisation, optimisation</p>
                  </div>
                  <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                    <p className="font-semibold text-purple-900 mb-2">Cookies de préférence</p>
                    <p className="text-purple-800 text-sm">Langue, paramètres personnalisés</p>
                  </div>
                  <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                    <p className="font-semibold text-purple-900 mb-2">Cookies publicitaires</p>
                    <p className="text-purple-800 text-sm">Publicités ciblées (avec consentement)</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-gray-800">Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur. Le refus de certains cookies peut limiter certaines fonctionnalités.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">12</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">SÉCURITÉ DES DONNÉES</h2>
                <p className="text-gray-700 text-lg mb-6">AMNAFI met en œuvre :</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-200">
                    <Lock className="w-6 h-6 text-green-600" />
                    <p className="text-gray-800">Chiffrement HTTPS</p>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-200">
                    <Shield className="w-6 h-6 text-green-600" />
                    <p className="text-gray-800">Contrôles d'accès stricts</p>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-200">
                    <FileText className="w-6 h-6 text-green-600" />
                    <p className="text-gray-800">Sauvegardes sécurisées</p>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-200">
                    <Eye className="w-6 h-6 text-green-600" />
                    <p className="text-gray-800">Protection anti-intrusion</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 13 */}
          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">13</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">CONSENTEMENT ET RETRAIT</h2>
                <p className="text-gray-700 text-lg mb-6">En utilisant AMNAFI, vous consentez à la collecte et au traitement de vos données selon cette politique.</p>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 p-6 rounded-2xl">
                  <p className="font-semibold text-gray-900 mb-4 text-lg">Vous pouvez retirer votre consentement à tout moment :</p>
                  <ul className="space-y-3 text-gray-800">
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> En modifiant vos paramètres de compte</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> En désactivant la géolocalisation</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> En supprimant votre compte</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> En nous contactant par email</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 14 */}
          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">14</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">DROITS DES UTILISATEURS</h2>
                <p className="text-gray-700 text-lg mb-6">Conformément à la loi sénégalaise, vous disposez de :</p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-purple-50 p-4 rounded-xl border-l-4 border-purple-500">
                    <p className="font-semibold text-purple-900">Droit d'accès</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border-l-4 border-purple-500">
                    <p className="font-semibold text-purple-900">Droit de rectification</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border-l-4 border-purple-500">
                    <p className="font-semibold text-purple-900">Droit de suppression</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border-l-4 border-purple-500">
                    <p className="font-semibold text-purple-900">Droit d'opposition</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 p-6 rounded-2xl">
                  <p className="text-green-900 font-semibold mb-3 text-lg">Pour exercer vos droits :</p>
                  <p className="text-green-800 flex items-center gap-2 text-lg">
                    <Mail className="w-5 h-5" />
                    amnaficontact@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 15 */}
          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">15</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">TRANSFERT DE DONNÉES</h2>
                <p className="text-gray-700 text-lg mb-6">Vos données sont stockées et traitées principalement au Sénégal.</p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                  <p className="text-blue-900 font-semibold mb-3">En cas de transfert international :</p>
                  <ul className="space-y-2 text-blue-800">
                    <li>✓ Nous garantissons un niveau de protection adéquat</li>
                    <li>✓ Conformément aux standards internationaux</li>
                    <li>✓ Avec des garanties contractuelles appropriées</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 16 */}
          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">16</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">MODIFICATION DE LA POLITIQUE</h2>
                <p className="text-gray-700 text-lg mb-6">AMNAFI se réserve le droit de modifier cette Politique de Confidentialité à tout moment.</p>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-2xl">
                  <p className="text-yellow-900 font-semibold mb-3">En cas de modification importante :</p>
                  <ul className="space-y-2 text-yellow-800">
                    <li>✓ Vous serez informé(e) par email ou notification</li>
                    <li>✓ La date de dernière mise à jour sera actualisée</li>
                    <li>✓ Votre utilisation continue vaut acceptation</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 17 */}
          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">17</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">RÉCLAMATIONS ET RECOURS</h2>
                <p className="text-gray-700 text-lg mb-6">Si vous estimez que vos droits ne sont pas respectés, vous pouvez :</p>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-2 border-orange-200">
                    <p className="font-semibold text-gray-900 mb-2">1. Nous contacter directement</p>
                    <p className="text-gray-700">amnaficontact@gmail.com</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-2 border-orange-200">
                    <p className="font-semibold text-gray-900 mb-2">2. Saisir la Commission de Protection des Données Personnelles (CDP)</p>
                    <p className="text-gray-700">Autorité de contrôle compétente au Sénégal</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-2 border-orange-200">
                    <p className="font-semibold text-gray-900 mb-2">3. Engager une action en justice</p>
                    <p className="text-gray-700">Devant les tribunaux compétents du Sénégal</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 18 */}
          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">18</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">DISPOSITIONS GÉNÉRALES</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="font-semibold text-gray-900 mb-2">Loi applicable :</p>
                    <p className="text-gray-700">La présente politique est régie par le droit sénégalais</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="font-semibold text-gray-900 mb-2">Juridiction compétente :</p>
                    <p className="text-gray-700">Tribunaux de Dakar, Sénégal</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="font-semibold text-gray-900 mb-2">Langue :</p>
                    <p className="text-gray-700">En cas de traduction, la version française fait foi</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="font-semibold text-gray-900 mb-2">Séparabilité :</p>
                    <p className="text-gray-700">Si une clause est invalidée, les autres restent en vigueur</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 19 - Contact */}
          <section className="border-t-2 border-orange-100 pt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">19</div>
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

          {/* Footer */}
          <div className="text-center pt-12 border-t-2 border-orange-100">
            <p className="text-gray-500 text-sm mb-2">Dernière mise à jour : Février 2026</p>
            <p className="text-gray-400 text-xs">© 2026 AMNAFI - Tous droits réservés</p>
          </div>
        </div>
      </div>
    </div>
  );
}
