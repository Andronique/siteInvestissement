
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheck, FaTimes, FaEdit, FaEye, FaPlus } from 'react-icons/fa';

const Users = ({ users: initialUsers, handleUserAction, handleAddBalance }) => {
  const [users, setUsers] = useState(initialUsers);
  const [modalType, setModalType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

  const openModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
    reset();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedUser(null);
    reset();
  };

  const onSuspendSubmit = () => {
    if (selectedUser) {
      const newStatus = selectedUser.status === 'Actif' ? 'Suspendu' : 'Actif';
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
      handleUserAction(selectedUser.id, newStatus === 'Suspendu' ? 'Suspendre' : 'Activer');
      console.log(`User ${selectedUser.name} ${newStatus}`);
      closeModal();
    }
  };

  const onResetPasswordSubmit = (data) => {
    if (selectedUser && data.password && data.password === data.confirmPassword) {
      handleUserAction(selectedUser.id, 'Reset Password');
      console.log(`Password reset for ${selectedUser.name} to ${data.password}`);
      closeModal();
    }
  };

  const onAddBalanceSubmit = (data) => {
    if (selectedUser && data.amount && data.currency) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, balance: u.balance + Number(data.amount) } : u));
      handleAddBalance(selectedUser.id);
      console.log(`Added ${data.amount} ${data.currency} to ${selectedUser.name}'s balance`);
      closeModal();
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des utilisateurs</h2>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
        <div className="p-4">
          <h3 className="text-white text-sm sm:text-lg md:text-xl">Liste des utilisateurs</h3>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-white text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-2 sm:p-3 text-left">Nom</th>
                  <th className="p-2 sm:p-3 text-left">WhatsApp</th>
                  <th className="p-2 sm:p-3 text-left">Parrain</th>
                  <th className="p-2 sm:p-3 text-left">Solde</th>
                  <th className="p-2 sm:p-3 text-left">Statut</th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">{user.name}</td>
                    <td className="p-2 sm:p-3">{user.whatsapp}</td>
                    <td className="p-2 sm:p-3">{user.referrer}</td>
                    <td className="p-2 sm:p-3">{user.balance.toLocaleString()} Ar</td>
                    <td className="p-2 sm:p-3">{user.status}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <button
                        className={`text-white ${user.status === 'Actif' ? 'bg-red-600' : 'bg-green-600'} border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center`}
                        onClick={() => openModal('suspend', user)}
                        aria-label={user.status === 'Actif' ? 'Suspendre utilisateur' : 'Activer utilisateur'}
                      >
                        {user.status === 'Actif' ? <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : <FaCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
                        {user.status === 'Actif' ? 'Suspendre' : 'Activer'}
                      </button>
                      <button
                        className="text-white bg-blue-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('reset', user)}
                        aria-label="Réinitialiser le mot de passe"
                      >
                        <FaEdit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Réinitialiser
                      </button>
                      <button
                        className="text-white bg-green-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('view', user)}
                        aria-label="Voir le tableau de bord"
                      >
                        <FaEye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Voir
                      </button>
                      <button
                        className="text-white bg-yellow-500 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('addBalance', user)}
                        aria-label="Ajouter un solde"
                      >
                        <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Ajouter Solde
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Suspend/Activate Modal */}
      {modalType === 'suspend' && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">{selectedUser.status === 'Actif' ? 'Suspendre' : 'Activer'} Utilisateur</h3>
            <div className="p-4">
              <p>Êtes-vous sûr de vouloir {selectedUser.status === 'Actif' ? 'suspendre' : 'activer'} {selectedUser.name} ?</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                className="text-white bg-gray-600 px-4 py-2 rounded text-xs sm:text-sm"
                onClick={closeModal}
              >
                Annuler
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
                onClick={onSuspendSubmit}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {modalType === 'reset' && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Réinitialiser le mot de passe pour {selectedUser.name}</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm">Nouveau mot de passe</label>
                <input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Mot de passe requis', minLength: { value: 6, message: 'Minimum 6 caractères' } })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm">Confirmer le mot de passe</label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Confirmation requise',
                    validate: value => value === watch('password') || 'Les mots de passe ne correspondent pas'
                  })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  className="text-white bg-gray-600 px-4 py-2 rounded text-xs sm:text-sm"
                  onClick={closeModal}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onResetPasswordSubmit)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Dashboard Modal */}
      {modalType === 'view' && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Tableau de bord de {selectedUser.name}</h3>
            <div className="p-4 space-y-2">
              <p><strong>Nom:</strong> {selectedUser.name}</p>
              <p><strong>WhatsApp:</strong> {selectedUser.whatsapp}</p>
              <p><strong>Parrain:</strong> {selectedUser.referrer}</p>
              <p><strong>Solde:</strong> {selectedUser.balance.toLocaleString()} Ar</p>
              <p><strong>Statut:</strong> {selectedUser.status}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                className="text-white bg-gray-600 px-4 py-2 rounded text-xs sm:text-sm"
                onClick={closeModal}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Balance Modal */}
      {modalType === 'addBalance' && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Ajouter un solde pour {selectedUser.name}</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm">Montant</label>
                <input
                  id="amount"
                  type="number"
                  {...register('amount', { required: 'Montant requis', min: { value: 1, message: 'Montant doit être supérieur à 0' } })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm">Devise</label>
                <select
                  id="currency"
                  {...register('currency', { required: 'Devise requise' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                >
                  <option value="">Sélectionner une devise</option>
                  <option value="Ar">Ar</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                {errors.currency && <p className="text-red-500 text-xs">{errors.currency.message}</p>}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  className="text-white bg-gray-600 px-4 py-2 rounded text-xs sm:text-sm"
                  onClick={closeModal}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onAddBalanceSubmit)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
