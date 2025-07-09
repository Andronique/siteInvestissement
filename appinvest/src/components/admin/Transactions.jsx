
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheck, FaTimes, FaEdit, FaTrash, FaPlus, FaDownload } from 'react-icons/fa';

const Transactions = ({ transactions: initialTransactions, handleTransactionAction }) => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(initialTransactions);
  const [modalType, setModalType] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const openModal = (type, transaction) => {
    setModalType(type);
    setSelectedTransaction(transaction || null);
    if (transaction && type === 'edit') {
      setValue('user', transaction.user);
      setValue('type', transaction.type);
      setValue('amount', transaction.amount);
      setValue('date', transaction.date);
      setValue('status', transaction.status);
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedTransaction(null);
    reset();
  };

  const onAddSubmit = (data) => {
    if (data.user && data.type && data.amount && data.date && data.status) {
      const newTransaction = {
        id: `txn${transactions.length + 1}`,
        user: data.user,
        type: data.type,
        amount: Number(data.amount),
        date: data.date,
        status: data.status,
      };
      setTransactions([...transactions, newTransaction]);
      setFilteredTransactions([...filteredTransactions, newTransaction]);
      handleTransactionAction(newTransaction.id, 'Ajouter');
      console.log(`Transaction added:`, newTransaction);
      closeModal();
    }
  };

  const onEditSubmit = (data) => {
    if (selectedTransaction && data.user && data.type && data.amount && data.date && data.status) {
      const updatedTransaction = {
        ...selectedTransaction,
        user: data.user,
        type: data.type,
        amount: Number(data.amount),
        date: data.date,
        status: data.status,
      };
      setTransactions(transactions.map(t => t.id === selectedTransaction.id ? updatedTransaction : t));
      setFilteredTransactions(filteredTransactions.map(t => t.id === selectedTransaction.id ? updatedTransaction : t));
      handleTransactionAction(selectedTransaction.id, 'Modifier');
      console.log(`Transaction ${selectedTransaction.id} edited:`, updatedTransaction);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedTransaction) {
      setTransactions(transactions.filter(t => t.id !== selectedTransaction.id));
      setFilteredTransactions(filteredTransactions.filter(t => t.id !== selectedTransaction.id));
      handleTransactionAction(selectedTransaction.id, 'Supprimer');
      console.log(`Transaction ${selectedTransaction.id} deleted`);
      closeModal();
    }
  };

  const onValidateSubmit = () => {
    if (selectedTransaction) {
      setTransactions(transactions.map(t => t.id === selectedTransaction.id ? { ...t, status: 'Validé' } : t));
      setFilteredTransactions(filteredTransactions.map(t => t.id === selectedTransaction.id ? { ...t, status: 'Validé' } : t));
      handleTransactionAction(selectedTransaction.id, 'Valider');
      console.log(`Transaction ${selectedTransaction.id} validated`);
      closeModal();
    }
  };

  const onRejectSubmit = () => {
    if (selectedTransaction) {
      setTransactions(transactions.map(t => t.id === selectedTransaction.id ? { ...t, status: 'Rejeté' } : t));
      setFilteredTransactions(filteredTransactions.map(t => t.id === selectedTransaction.id ? { ...t, status: 'Rejeté' } : t));
      handleTransactionAction(selectedTransaction.id, 'Rejeter');
      console.log(`Transaction ${selectedTransaction.id} rejected`);
      closeModal();
    }
  };

  const onBulkValidate = () => {
    setTransactions(transactions.map(t => selectedTransactions.includes(t.id) ? { ...t, status: 'Validé' } : t));
    setFilteredTransactions(filteredTransactions.map(t => selectedTransactions.includes(t.id) ? { ...t, status: 'Validé' } : t));
    selectedTransactions.forEach(id => handleTransactionAction(id, 'Valider'));
    console.log(`Bulk validated transactions:`, selectedTransactions);
    setSelectedTransactions([]);
  };

  const onBulkReject = () => {
    setTransactions(transactions.map(t => selectedTransactions.includes(t.id) ? { ...t, status: 'Rejeté' } : t));
    setFilteredTransactions(filteredTransactions.map(t => selectedTransactions.includes(t.id) ? { ...t, status: 'Rejeté' } : t));
    selectedTransactions.forEach(id => handleTransactionAction(id, 'Rejeter'));
    console.log(`Bulk rejected transactions:`, selectedTransactions);
    setSelectedTransactions([]);
  };

  const onExportSubmit = (data) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredTransactions.map(t => `${t.id},${t.user},${t.type},${t.amount},${t.date},${t.status}`).join('\n');
      const blob = new Blob([`id,user,type,amount,date,status\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting transactions as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data) => {
    let filtered = [...transactions];
    if (data.filterUser) {
      filtered = filtered.filter(t => t.user.toLowerCase().includes(data.filterUser.toLowerCase()));
    }
    if (data.filterType && data.filterType !== 'all') {
      filtered = filtered.filter(t => t.type === data.filterType);
    }
    if (data.filterDate) {
      filtered = filtered.filter(t => t.date === data.filterDate);
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === data.filterStatus);
    }
    setFilteredTransactions(filtered);
  };

  const sortTable = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredTransactions].sort((a, b) => {
      const aValue = field === 'amount' ? a[field] : a[field];
      const bValue = field === 'amount' ? b[field] : b[field];
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredTransactions(sorted);
  };

  const toggleSelectTransaction = (id) => {
    setSelectedTransactions(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTransactions.length === filteredTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(filteredTransactions.map(t => t.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des transactions</h2>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
        <div className="p-4">
          <h3 className="text-white text-sm sm:text-lg md:text-xl">Liste des transactions</h3>
        </div>
        <div className="p-4">
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded text-xs sm:text-sm flex items-center"
              onClick={() => openModal('add')}
              aria-label="Ajouter une transaction"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Ajouter une transaction
            </button>
            {selectedTransactions.length > 0 && (
              <>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm flex items-center"
                  onClick={onBulkValidate}
                  aria-label="Valider les transactions sélectionnées"
                >
                  <FaCheck className="w-4 h-4 mr-2" />
                  Valider sélection
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded text-xs sm:text-sm flex items-center"
                  onClick={onBulkReject}
                  aria-label="Rejeter les transactions sélectionnées"
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Rejeter sélection
                </button>
              </>
            )}
            <button
              className="bg-yellow-600 text-white px-4 py-2 rounded text-xs sm:text-sm flex items-center"
              onClick={() => openModal('export')}
              aria-label="Exporter les transactions"
            >
              <FaDownload className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Filtrer par utilisateur"
              {...register('filterUser')}
              className="p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
            />
            <select
              {...register('filterType')}
              className="p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
            >
              <option value="all">Tous</option>
              <option value="Dépôt">Dépôt</option>
              <option value="Retrait">Retrait</option>
            </select>
            <input
              type="date"
              {...register('filterDate')}
              className="p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
            />
            <select
              {...register('filterStatus')}
              className="p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
            >
              <option value="all">Tous</option>
              <option value="Validé">Validé</option>
              <option value="Rejeté">Rejeté</option>
              <option value="En attente">En attente</option>
            </select>
            <button
              type="button"
              onClick={handleSubmit(onFilterSubmit)}
              className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
            >
              Filtrer
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-white text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-2 sm:p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner toutes les transactions"
                    />
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('user')}
                  >
                    Utilisateur {sortField === 'user' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('type')}
                  >
                    Type {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('amount')}
                  >
                    Montant {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('date')}
                  >
                    Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('status')}
                  >
                    Statut {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.includes(transaction.id)}
                        onChange={() => toggleSelectTransaction(transaction.id)}
                        aria-label={`Sélectionner la transaction ${transaction.id}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{transaction.user}</td>
                    <td className="p-2 sm:p-3">{transaction.type}</td>
                    <td className="p-2 sm:p-3">{transaction.amount.toLocaleString()} Ar</td>
                    <td className="p-2 sm:p-3">{transaction.date}</td>
                    <td className="p-2 sm:p-3">{transaction.status}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <button
                        className="text-white bg-green-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('validate', transaction)}
                        aria-label="Valider la transaction"
                      >
                        <FaCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        
                      </button>
                      <button
                        className="text-white bg-red-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('reject', transaction)}
                        aria-label="Rejeter la transaction"
                      >
                        <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        
                      </button>
                      <button
                        className="text-white bg-blue-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('edit', transaction)}
                        aria-label="Modifier la transaction"
                      >
                        <FaEdit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                       
                      </button>
                      <button
                        className="text-white bg-yellow-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('delete', transaction)}
                        aria-label="Supprimer la transaction"
                      >
                        <FaTrash className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {modalType === 'add' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Ajouter une transaction</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="user" className="block text-sm">Utilisateur</label>
                <input
                  id="user"
                  {...register('user', { required: 'Utilisateur requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.user && <p className="text-red-500 text-xs">{errors.user.message}</p>}
              </div>
              <div>
                <label htmlFor="type" className="block text-sm">Type</label>
                <select
                  id="type"
                  {...register('type', { required: 'Type requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Dépôt">Dépôt</option>
                  <option value="Retrait">Retrait</option>
                </select>
                {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm">Montant (Ar)</label>
                <input
                  id="amount"
                  type="number"
                  {...register('amount', { required: 'Montant requis', min: { value: 1, message: 'Montant doit être supérieur à 0' } })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
              </div>
              <div>
                <label htmlFor="date" className="block text-sm">Date</label>
                <input
                  id="date"
                  type="date"
                  {...register('date', { required: 'Date requise' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
              </div>
              <div>
                <label htmlFor="status" className="block text-sm">Statut</label>
                <select
                  id="status"
                  {...register('status', { required: 'Statut requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                >
                  <option value="">Sélectionner un statut</option>
                  <option value="Validé">Validé</option>
                  <option value="Rejeté">Rejeté</option>
                  <option value="En attente">En attente</option>
                </select>
                {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
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
                  onClick={handleSubmit(onAddSubmit)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {modalType === 'edit' && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Modifier la transaction</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="user" className="block text-sm">Utilisateur</label>
                <input
                  id="user"
                  {...register('user', { required: 'Utilisateur requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.user && <p className="text-red-500 text-xs">{errors.user.message}</p>}
              </div>
              <div>
                <label htmlFor="type" className="block text-sm">Type</label>
                <select
                  id="type"
                  {...register('type', { required: 'Type requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Dépôt">Dépôt</option>
                  <option value="Retrait">Retrait</option>
                </select>
                {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm">Montant (Ar)</label>
                <input
                  id="amount"
                  type="number"
                  {...register('amount', { required: 'Montant requis', min: { value: 1, message: 'Montant doit être supérieur à 0' } })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
              </div>
              <div>
                <label htmlFor="date" className="block text-sm">Date</label>
                <input
                  id="date"
                  type="date"
                  {...register('date', { required: 'Date requise' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
              </div>
              <div>
                <label htmlFor="status" className="block text-sm">Statut</label>
                <select
                  id="status"
                  {...register('status', { required: 'Statut requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                >
                  <option value="">Sélectionner un statut</option>
                  <option value="Validé">Validé</option>
                  <option value="Rejeté">Rejeté</option>
                  <option value="En attente">En attente</option>
                </select>
                {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
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
                  onClick={handleSubmit(onEditSubmit)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Transaction Modal */}
      {modalType === 'delete' && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Supprimer la transaction</h3>
            <div className="p-4">
              <p>Supprimer la transaction de {selectedTransaction.amount.toLocaleString()} Ar pour {selectedTransaction.user} ?</p>
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
                onClick={onDeleteSubmit}
                disabled={!selectedTransaction}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validate Transaction Modal */}
      {modalType === 'validate' && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Valider la transaction</h3>
            <div className="p-4">
              <p>Valider la transaction de {selectedTransaction.amount.toLocaleString()} Ar pour {selectedTransaction.user} ?</p>
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
                disabled={!selectedTransaction}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Transaction Modal */}
      {modalType === 'reject' && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Rejeter la transaction</h3>
            <div className="p-4">
              <p>Rejeter la transaction de {selectedTransaction.amount.toLocaleString()} Ar pour {selectedTransaction.user} ?</p>
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
                disabled={!selectedTransaction}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Transactions Modal */}
      {modalType === 'export' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Exporter les transactions</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="exportFormat" className="block text-sm">Format</label>
                <select
                  id="exportFormat"
                  {...register('exportFormat', { required: 'Format requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                >
                  <option value="">Sélectionner un format</option>
                  <option value="CSV">CSV</option>
                  <option value="PDF">PDF</option>
                </select>
                {errors.exportFormat && <p className="text-red-500 text-xs">{errors.exportFormat.message}</p>}
              </div>
              <div>
                <label htmlFor="exportStartDate" className="block text-sm">Date de début</label>
                <input
                  id="exportStartDate"
                  type="date"
                  {...register('exportStartDate', { required: 'Date de début requise' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.exportStartDate && <p className="text-red-500 text-xs">{errors.exportStartDate.message}</p>}
              </div>
              <div>
                <label htmlFor="exportEndDate" className="block text-sm">Date de fin</label>
                <input
                  id="exportEndDate"
                  type="date"
                  {...register('exportEndDate', { required: 'Date de fin requise' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.exportEndDate && <p className="text-red-500 text-xs">{errors.exportEndDate.message}</p>}
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

export default Transactions;