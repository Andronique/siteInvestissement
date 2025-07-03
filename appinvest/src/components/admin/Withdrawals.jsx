
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheck, FaTimes } from 'react-icons/fa';

const Withdrawals = ({ withdrawals: initialWithdrawals, handleWithdrawalAction }) => {
  const [withdrawals, setWithdrawals] = useState(initialWithdrawals);
  const [modalType, setModalType] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const openModal = (type, withdrawal) => {
    setModalType(type);
    setSelectedWithdrawal(withdrawal || null);
    reset();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedWithdrawal(null);
    reset();
  };

  const onValidateSubmit = () => {
    if (selectedWithdrawal) {
      setWithdrawals(withdrawals.map(w => w.id === selectedWithdrawal.id ? { ...w, status: 'Validé' } : w));
      handleWithdrawalAction(selectedWithdrawal.id, 'Valider');
      console.log(`Withdrawal ${selectedWithdrawal.id} validated`);
      closeModal();
    }
  };

  const onRejectSubmit = () => {
    if (selectedWithdrawal) {
      setWithdrawals(withdrawals.map(w => w.id === selectedWithdrawal.id ? { ...w, status: 'Rejeté' } : w));
      handleWithdrawalAction(selectedWithdrawal.id, 'Rejeter');
      console.log(`Withdrawal ${selectedWithdrawal.id} rejected`);
      closeModal();
    }
  };

  const onExportSubmit = (data) => {
    if (data.format === 'CSV') {
      const csv = withdrawals.map(w => `${w.id},${w.user},${w.amount},${w.method},${w.number},${w.status}`).join('\n');
      const blob = new Blob([`id,user,amount,method,number,status\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `withdrawals_${data.startDate}_${data.endDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting withdrawals as ${data.format} from ${data.startDate} to ${data.endDate}`);
    }
    closeModal();
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des retraits</h2>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
        <div className="p-4">
          <h3 className="text-white text-sm sm:text-lg md:text-xl">Liste des retraits</h3>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <button
              className="text-white bg-green-500 border border-white/20 hover:bg-white/20 px-4 py-2 rounded text-xs sm:text-sm"
              onClick={() => openModal('export')}
              aria-label="Exporter l'historique"
            >
              Exporter l'historique
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-white text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-2 sm:p-3 text-left">Utilisateur</th>
                  <th className="p-2 sm:p-3 text-left">Montant</th>
                  <th className="p-2 sm:p-3 text-left">Méthode</th>
                  <th className="p-2 sm:p-3 text-left">Numéro</th>
                  <th className="p-2 sm:p-3 text-left">Statut</th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">{withdrawal.user}</td>
                    <td className="p-2 sm:p-3">{withdrawal.amount.toLocaleString()} Ar</td>
                    <td className="p-2 sm:p-3">{withdrawal.method}</td>
                    <td className="p-2 sm:p-3">{withdrawal.number}</td>
                    <td className="p-2 sm:p-3">{withdrawal.status}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <button
                        className="text-white bg-green-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('validate', withdrawal)}
                        aria-label="Valider le retrait"
                      >
                        <FaCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Valider
                      </button>
                      <button
                        className="text-white bg-red-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('reject', withdrawal)}
                        aria-label="Rejeter le retrait"
                      >
                        <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Rejeter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Validate Modal */}
      {modalType === 'validate' && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Valider le retrait</h3>
            <div className="p-4">
              <p>Valider le retrait de {selectedWithdrawal.amount.toLocaleString()} Ar pour {selectedWithdrawal.user} ?</p>
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
                onClick={onValidateSubmit}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {modalType === 'reject' && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Rejeter le retrait</h3>
            <div className="p-4">
              <p>Rejeter le retrait de {selectedWithdrawal.amount.toLocaleString()} Ar pour {selectedWithdrawal.user} ?</p>
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
                onClick={onRejectSubmit}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {modalType === 'export' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Exporter l'historique des retraits</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="format" className="block text-sm">Format</label>
                <select
                  id="format"
                  {...register('format', { required: 'Format requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                >
                  <option value="">Sélectionner un format</option>
                  <option value="CSV">CSV</option>
                  <option value="PDF">PDF</option>
                </select>
                {errors.format && <p className="text-red-500 text-xs">{errors.format.message}</p>}
              </div>
              <div>
                <label htmlFor="startDate" className="block text-sm">Date de début</label>
                <input
                  id="startDate"
                  type="date"
                  {...register('startDate', { required: 'Date de début requise' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate.message}</p>}
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm">Date de fin</label>
                <input
                  id="endDate"
                  type="date"
                  {...register('endDate', { required: 'Date de fin requise' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.endDate && <p className="text-red-500 text-xs">{errors.endDate.message}</p>}
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
                  onClick={handleSubmit(onExportSubmit)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
                >
                  Exporter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdrawals;