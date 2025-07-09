'use client';

import { useState } from 'react';
import { BiCheck as Check, BiX as X, BiEdit as Edit, BiTrash as Trash, BiPlus as Plus, BiDownload as Download } from 'react-icons/bi';
import { useForm } from 'react-hook-form';

export default function Admins({ admins: initialAdmins, handleAdminAction }) {
  const [admins, setAdmins] = useState(initialAdmins.map(admin => ({
    ...admin,
    email: admin.email || `${admin.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    lastModified: admin.lastModified || new Date().toISOString().split('T')[0],
  })));
  const [filteredAdmins, setFilteredAdmins] = useState(admins);
  const [modalType, setModalType] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedAdminIds, setSelectedAdminIds] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const openModal = (type, admin) => {
    setModalType(type);
    setSelectedAdmin(admin || null);
    if (admin && type === 'edit') {
      setValue('name', admin.name);
      setValue('email', admin.email);
      setValue('role', admin.role);
      setValue('status', admin.status);
      setValue('lastModified', admin.lastModified);
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedAdmin(null);
    reset();
  };

  const onAddSubmit = (data) => {
    if (data.name && data.email && data.role && data.status) {
      const newAdmin = {
        id: `a${admins.length + 1}`,
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        lastModified: data.lastModified || new Date().toISOString().split('T')[0],
      };
      setAdmins([...admins, newAdmin]);
      setFilteredAdmins([...filteredAdmins, newAdmin]);
      handleAdminAction(newAdmin.id, 'Ajouter');
      console.log(`Admin added:`, newAdmin);
      closeModal();
    }
  };

  const onEditSubmit = (data) => {
    if (selectedAdmin && data.name && data.email && data.role && data.status) {
      const updatedAdmin = {
        ...selectedAdmin,
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        lastModified: data.lastModified || new Date().toISOString().split('T')[0],
      };
      setAdmins(admins.map(a => a.id === selectedAdmin.id ? updatedAdmin : a));
      setFilteredAdmins(filteredAdmins.map(a => a.id === selectedAdmin.id ? updatedAdmin : a));
      handleAdminAction(selectedAdmin.id, 'Modifier');
      console.log(`Admin ${selectedAdmin.id} edited:`, updatedAdmin);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedAdmin) {
      setAdmins(admins.filter(a => a.id !== selectedAdmin.id));
      setFilteredAdmins(filteredAdmins.filter(a => a.id !== selectedAdmin.id));
      handleAdminAction(selectedAdmin.id, 'Supprimer');
      console.log(`Admin ${selectedAdmin.id} deleted`);
      closeModal();
    }
  };

  const onBulkActivate = () => {
    setAdmins(admins.map(a => selectedAdminIds.includes(a.id) ? { ...a, status: 'Actif', lastModified: new Date().toISOString().split('T')[0] } : a));
    setFilteredAdmins(filteredAdmins.map(a => selectedAdminIds.includes(a.id) ? { ...a, status: 'Actif', lastModified: new Date().toISOString().split('T')[0] } : a));
    selectedAdminIds.forEach(id => handleAdminAction(id, 'Activer'));
    console.log(`Bulk activated admins:`, selectedAdminIds);
    setSelectedAdminIds([]);
  };

  const onBulkDeactivate = () => {
    setAdmins(admins.map(a => selectedAdminIds.includes(a.id) ? { ...a, status: 'Inactif', lastModified: new Date().toISOString().split('T')[0] } : a));
    setFilteredAdmins(filteredAdmins.map(a => selectedAdminIds.includes(a.id) ? { ...a, status: 'Inactif', lastModified: new Date().toISOString().split('T')[0] } : a));
    selectedAdminIds.forEach(id => handleAdminAction(id, 'Désactiver'));
    console.log(`Bulk deactivated admins:`, selectedAdminIds);
    setSelectedAdminIds([]);
  };

  const onBulkDelete = () => {
    setAdmins(admins.filter(a => !selectedAdminIds.includes(a.id)));
    setFilteredAdmins(filteredAdmins.filter(a => !selectedAdminIds.includes(a.id)));
    selectedAdminIds.forEach(id => handleAdminAction(id, 'Supprimer'));
    console.log(`Bulk deleted admins:`, selectedAdminIds);
    setSelectedAdminIds([]);
  };

  const onExportSubmit = (data) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredAdmins.map(a => `${a.id},${a.name},${a.email},${a.role},${a.status},${a.lastModified}`).join('\n');
      const blob = new Blob([`id,name,email,role,status,lastModified\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admins_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting admins as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data) => {
    let filtered = [...admins];
    if (data.filterName) {
      filtered = filtered.filter(a => a.name.toLowerCase().includes(data.filterName.toLowerCase()));
    }
    if (data.filterRole) {
      filtered = filtered.filter(a => a.role.toLowerCase().includes(data.filterRole.toLowerCase()));
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status === data.filterStatus);
    }
    if (data.filterDate) {
      filtered = filtered.filter(a => a.lastModified === data.filterDate);
    }
    setFilteredAdmins(filtered);
  };

  const sortTable = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredAdmins].sort((a, b) => {
      const aValue = a[field] || '';
      const bValue = b[field] || '';
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredAdmins(sorted);
  };

  const toggleSelectAdmin = (id) => {
    setSelectedAdminIds(prev =>
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAdminIds.length === filteredAdmins.length) {
      setSelectedAdminIds([]);
    } else {
      setSelectedAdminIds(filteredAdmins.map(a => a.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion multi-admin</h2>
      <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
        <div className="p-4 sm:p-6">
          <h3 className="text-white text-sm sm:text-lg md:text-xl mb-4">Liste des administrateurs</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <button
              className="bg-green-500 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
              onClick={() => openModal('add')}
              aria-label="Ajouter un administrateur"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un administrateur
            </button>
            {selectedAdminIds.length > 0 && (
              <>
                <button
                  className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
                  onClick={onBulkActivate}
                  aria-label="Activer les administrateurs sélectionnés"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Activer sélection
                </button>
                <button
                  className="bg-yellow-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
                  onClick={onBulkDeactivate}
                  aria-label="Désactiver les administrateurs sélectionnés"
                >
                  <X className="w-4 h-4 mr-2" />
                
                </button>
                <button
                  className="bg-red-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
                  onClick={onBulkDelete}
                  aria-label="Supprimer les administrateurs sélectionnés"
                >
                  <Trash className="w-4 h-4 mr-2" />
               
                </button>
              </>
            )}
            <button
              className="bg-yellow-400 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
              onClick={() => openModal('export')}
              aria-label="Exporter les administrateurs"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
          <form onSubmit={handleSubmit(onFilterSubmit)} className="mb-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Filtrer par nom"
              {...register('filterName')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <input
              type="text"
              placeholder="Filtrer par rôle"
              {...register('filterRole')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <select
              {...register('filterStatus')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            >
              <option value="all">Tous</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
            </select>
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
                  <th className="p-2 sm:p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedAdminIds.length === filteredAdmins.length && filteredAdmins.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner tous les administrateurs"
                    />
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('name')}
                  >
                    Nom {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('email')}
                  >
                    Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('role')}
                  >
                    Rôle {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('status')}
                  >
                    Statut {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('lastModified')}
                  >
                    Dernière modification {sortField === 'lastModified' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedAdminIds.includes(admin.id)}
                        onChange={() => toggleSelectAdmin(admin.id)}
                        aria-label={`Sélectionner l'administrateur ${admin.name}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{admin.name}</td>
                    <td className="p-2 sm:p-3">{admin.email}</td>
                    <td className="p-2 sm:p-3">{admin.role}</td>
                    <td className="p-2 sm:p-3">{admin.status}</td>
                    <td className="p-2 sm:p-3">{admin.lastModified}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                    <button
                        className="text-white bg-yellow-500 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => {
                          const updatedStatus = admin.status === 'Actif' ? 'Inactif' : 'Actif';
                          const updatedAdmin = { ...admin, status: updatedStatus, lastModified: new Date().toISOString().split('T')[0] };
                          setAdmins(prev => prev.map(a => a.id === admin.id ? updatedAdmin : a));
                          setFilteredAdmins(prev => prev.map(a => a.id === admin.id ? updatedAdmin : a));
                          handleAdminAction(admin.id, updatedStatus === 'Actif' ? 'Activer' : 'Désactiver');
                        }}
                        aria-label={admin.status === 'Actif' ? `Désactiver l'administrateur ${admin.name}` : `Activer l'administrateur ${admin.name}`}
                      >
                        {admin.status === 'Actif' ? <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
                        {admin.status === 'Actif' ? '' : ''}
                      </button>

                      <button
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('edit', admin)}
                        aria-label={`Modifier l'administrateur ${admin.name}`}
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                       
                      </button>
                      <button
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('delete', admin)}
                        aria-label={`Supprimer l'administrateur ${admin.name}`}
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

      {/* Add Admin Modal */}
     <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'add' ? '' : 'hidden'}`}>
    <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
    <h3 className="text-lg font-semibold mb-4">Ajouter un administrateur</h3>
     <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm">Nom</label>
        <input
          id="name"
          {...register('name', { required: 'Nom requis' })}
          className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', { required: 'Email requis', pattern: { value: /^\S+@\S+$/, message: 'Email invalide' } })}
          className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm">Rôle</label>
        <select
          id="role"
          {...register('role', { required: 'Rôle requis' })}
          className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
        >
          <option value="" disabled>Sélectionner un rôle</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Admin">Admin</option>
          <option value="Modérateur">Modérateur</option>
        </select>
        {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm">Statut</label>
        <select
          id="status"
          {...register('status', { required: 'Statut requis' })}
          className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
        >
          <option value="" disabled>Sélectionner un statut</option>
          <option value="Actif">Actif</option>
          <option value="Inactif">Inactif</option>
        </select>
        {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
      </div>

      <div>
        <label htmlFor="lastModified" className="block text-sm">Dernière modification</label>
        <input
          id="lastModified"
          type="date"
          {...register('lastModified')}
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

      {/* Edit Admin Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'edit' && !!selectedAdmin ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Modifier l'administrateur</h3>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm">Nom</label>
              <input
                id="name"
                {...register('name', { required: 'Nom requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm">Email</label>
              <input
                id="email"
                type="email"
                {...register('email', { required: 'Email requis', pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' } })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="role" className="block text-sm">Rôle</label>
              <select
                id="role"
                {...register('role', { required: 'Rôle requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              >
                <option value="" disabled>Sélectionner un rôle</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Modérateur">Modérateur</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm">Statut</label>
              <select
                id="status"
                {...register('status', { required: 'Statut requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              >
                <option value="" disabled>Sélectionner un statut</option>
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            <div>
              <label htmlFor="lastModified" className="block text-sm">Dernière modification</label>
              <input
                id="lastModified"
                type="date"
                {...register('lastModified')}
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

      {/* Delete Admin Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'delete' && !!selectedAdmin ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Supprimer l'administrateur</h3>
          <div className="p-4">
            {selectedAdmin ? (
              <p>Supprimer l'administrateur "{selectedAdmin.name}" ({selectedAdmin.email}) ?</p>
            ) : (
              <p>Aucun administrateur sélectionné.</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
            <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded" onClick={onDeleteSubmit} disabled={!selectedAdmin}>Confirmer</button>
          </div>
        </div>
      </div>

      {/* Export Admins Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'export' ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Exporter les administrateurs</h3>
          <form onSubmit={handleSubmit(onExportSubmit)} className="space-y-4">
            <div>
              <label htmlFor="exportFormat" className="block text-sm">Format</label>
              <select
                id="exportFormat"
                {...register('exportFormat', { required: 'Format requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              >
                <option value="" disabled>Sélectionner un format</option>
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
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.exportStartDate && <p className="text-red-500 text-xs">{errors.exportStartDate.message}</p>}
            </div>
            <div>
              <label htmlFor="exportEndDate" className="block text-sm">Date de fin</label>
              <input
                id="exportEndDate"
                type="date"
                {...register('exportEndDate', { required: 'Date de fin requise' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.exportEndDate && <p className="text-red-500 text-xs">{errors.exportEndDate.message}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
              <button type="submit" className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded">Exporter</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}