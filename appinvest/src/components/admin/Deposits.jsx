'use client';

import { useState } from 'react';
import { BiCheck as Check, BiX as X, BiEdit as Edit, BiTrash as Trash } from 'react-icons/bi';
import { useForm } from 'react-hook-form';

export default function Deposits({ deposits: initialDeposits, handleDepositAction }) {
  const [deposits, setDeposits] = useState(initialDeposits);
  const [modalType, setModalType] = useState(null);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [filteredDeposits, setFilteredDeposits] = useState(initialDeposits);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const openModal = (type, deposit) => {
    setModalType(type);
    setSelectedDeposit(deposit);
    reset({ user: deposit.user, amount: deposit.amount, currency: deposit.currency, date: deposit.date, proof: deposit.proof });
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedDeposit(null);
    reset();
  };

  const onValidateSubmit = () => {
    if (selectedDeposit) {
      setDeposits(deposits.map(d => d.id === selectedDeposit.id ? { ...d, status: 'Validé' } : d));
      setFilteredDeposits(filteredDeposits.map(d => d.id === selectedDeposit.id ? { ...d, status: 'Validé' } : d));
      handleDepositAction(selectedDeposit.id, 'Valider');
      console.log(`Deposit ${selectedDeposit.id} validated`);
      closeModal();
    }
  };

  const onRejectSubmit = () => {
    if (selectedDeposit) {
      setDeposits(deposits.map(d => d.id === selectedDeposit.id ? { ...d, status: 'Rejeté' } : d));
      setFilteredDeposits(filteredDeposits.map(d => d.id === selectedDeposit.id ? { ...d, status: 'Rejeté' } : d));
      handleDepositAction(selectedDeposit.id, 'Rejeter');
      console.log(`Deposit ${selectedDeposit.id} rejected`);
      closeModal();
    }
  };

  const onModifySubmit = (data) => {
    if (selectedDeposit && data.user && data.amount && data.currency && data.date) {
      const updatedDeposit = { ...selectedDeposit, user: data.user, amount: Number(data.amount), currency: data.currency, date: data.date, proof: data.proof || selectedDeposit.proof };
      setDeposits(deposits.map(d => d.id === selectedDeposit.id ? updatedDeposit : d));
      setFilteredDeposits(filteredDeposits.map(d => d.id === selectedDeposit.id ? updatedDeposit : d));
      handleDepositAction(selectedDeposit.id, 'Modifier');
      console.log(`Deposit ${selectedDeposit.id} modified:`, updatedDeposit);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedDeposit) {
      setDeposits(deposits.filter(d => d.id !== selectedDeposit.id));
      setFilteredDeposits(filteredDeposits.filter(d => d.id !== selectedDeposit.id));
      handleDepositAction(selectedDeposit.id, 'Supprimer');
      console.log(`Deposit ${selectedDeposit.id} deleted`);
      closeModal();
    }
  };

  const onFilterSubmit = (data) => {
    let filtered = [...deposits];
    if (data.filterUser) {
      filtered = filtered.filter(d => d.user.toLowerCase().includes(data.filterUser.toLowerCase()));
    }
    if (data.filterDate) {
      filtered = filtered.filter(d => d.date === data.filterDate);
    }
    setFilteredDeposits(filtered);
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des dépôts</h2>
      <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
        <div className="p-4 sm:p-6">
          <h3 className="text-white text-sm sm:text-lg md:text-xl mb-4">Liste des dépôts</h3>
        </div>
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit(onFilterSubmit)} className="mb-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Filtrer par utilisateur"
              {...register('filterUser')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <input
              type="date"
              {...register('filterDate')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <button type="submit" className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded">Filtrer</button>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full text-white text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-2 sm:p-3 text-left">Utilisateur</th>
                  <th className="p-2 sm:p-3 text-left">Montant</th>
                  <th className="p-2 sm:p-3 text-left">Devise</th>
                  <th className="p-2 sm:p-3 text-left">Date</th>
                  <th className="p-2 sm:p-3 text-left">Statut</th>
                  <th className="p-2 sm:p-3 text-left">Preuve</th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeposits.map((deposit) => (
                  <tr key={deposit.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">{deposit.user}</td>
                    <td className="p-2 sm:p-3">{deposit.amount.toLocaleString()} {deposit.currency}</td>
                    <td className="p-2 sm:p-3">{deposit.currency}</td>
                    <td className="p-2 sm:p-3">{deposit.date}</td>
                    <td className="p-2 sm:p-3">{deposit.status}</td>
                    <td className="p-2 sm:p-3">
                      <a href={deposit.proof} className="text-blue-400 hover:underline text-xs sm:text-sm">Voir</a>
                    </td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <button
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('validate', deposit)}
                        aria-label="Valider le dépôt"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        
                      </button>
                      <button
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('reject', deposit)}
                        aria-label="Rejeter le dépôt"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        
                      </button>
                      <button
                        className="text-white bg-green-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('modify', deposit)}
                        aria-label="Modifier le dépôt"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                       
                      </button>
                      <button
                        className="text-white bg-yellow-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('delete', deposit)}
                        aria-label="Supprimer le dépôt"
                      >
                        <Trash className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        
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
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'validate' && !!selectedDeposit ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Valider le dépôt</h3>
          <div className="p-4">
            <p>Valider le dépôt de {selectedDeposit?.amount} {selectedDeposit?.currency} pour {selectedDeposit?.user} ?</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
            <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded" onClick={onValidateSubmit}>Confirmer</button>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'reject' && !!selectedDeposit ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Rejeter le dépôt</h3>
          <div className="p-4">
            <p>Rejeter le dépôt de {selectedDeposit?.amount} {selectedDeposit?.currency} pour {selectedDeposit?.user} ?</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
            <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded" onClick={onRejectSubmit}>Confirmer</button>
          </div>
        </div>
      </div>

      {/* Modify Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'modify' && !!selectedDeposit ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Modifier le dépôt</h3>
          <form onSubmit={handleSubmit(onModifySubmit)} className="space-y-4">
            <div>
              <label htmlFor="user" className="block text-sm">Utilisateur</label>
              <input
                id="user"
                {...register('user', { required: 'Utilisateur requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.user && <p className="text-red-500 text-xs">{errors.user.message}</p>}
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm">Montant</label>
              <input
                id="amount"
                type="number"
                {...register('amount', { required: 'Montant requis', min: { value: 1, message: 'Montant doit être supérieur à 0' } })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm">Devise</label>
              <input
                id="currency"
                {...register('currency', { required: 'Devise requise' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.currency && <p className="text-red-500 text-xs">{errors.currency.message}</p>}
            </div>
            <div>
              <label htmlFor="date" className="block text-sm">Date</label>
              <input
                id="date"
                type="date"
                {...register('date', { required: 'Date requise' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
            </div>
            <div>
              <label htmlFor="proof" className="block text-sm">Preuve</label>
              <input
                id="proof"
                type="text"
                {...register('proof')}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
              <button type="submit" className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded">Confirmer</button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'delete' && !!selectedDeposit ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Supprimer le dépôt</h3>
          <div className="p-4">
            <p>Supprimer le dépôt de {selectedDeposit?.amount} {selectedDeposit?.currency} pour {selectedDeposit?.user} ?</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
            <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded" onClick={onDeleteSubmit}>Confirmer</button>
          </div>
        </div>
      </div>
    </div>
  );
}