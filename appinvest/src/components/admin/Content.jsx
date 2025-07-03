'use client';

import { useState } from 'react';
import { FaEye as Eye, FaEdit as Edit, FaTrash as Trash, FaPlus as Plus, FaDownload as Download, FaCheck as Check } from 'react-icons/fa';

import { useForm } from 'react-hook-form';

export default function Content({ handleContentAction }) {
  const [contents, setContents] = useState([
    { id: 'c1', title: 'Page d\'accueil', status: 'Publiée', content: 'Contenu de la page d\'accueil', lastModified: '2025-06-25' },
    { id: 'c2', title: 'FAQ', status: 'Brouillon', content: 'Questions fréquentes', lastModified: '2025-06-24' },
  ]);
  const [filteredContents, setFilteredContents] = useState(contents);
  const [modalType, setModalType] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedContentIds, setSelectedContentIds] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const openModal = (type, content) => {
    setModalType(type);
    setSelectedContent(content || null);
    if (content && (type === 'edit' || type === 'view')) {
      setValue('title', content.title);
      setValue('status', content.status);
      setValue('content', content.content);
      setValue('lastModified', content.lastModified);
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedContent(null);
    reset();
  };

  const onAddSubmit = (data) => {
    if (data.title && data.status && data.content) {
      const newContent = {
        id: `c${contents.length + 1}`,
        title: data.title,
        status: data.status,
        content: data.content,
        lastModified: data.lastModified || new Date().toISOString().split('T')[0],
      };
      setContents([...contents, newContent]);
      setFilteredContents([...filteredContents, newContent]);
      handleContentAction(newContent.id, 'Ajouter');
      console.log(`Content added:`, newContent);
      closeModal();
    }
  };

  const onEditSubmit = (data) => {
    if (selectedContent && data.title && data.status && data.content) {
      const updatedContent = {
        ...selectedContent,
        title: data.title,
        status: data.status,
        content: data.content,
        lastModified: data.lastModified || new Date().toISOString().split('T')[0],
      };
      setContents(contents.map(c => c.id === selectedContent.id ? updatedContent : c));
      setFilteredContents(filteredContents.map(c => c.id === selectedContent.id ? updatedContent : c));
      handleContentAction(selectedContent.id, 'Modifier');
      console.log(`Content ${selectedContent.id} edited:`, updatedContent);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedContent) {
      setContents(contents.filter(c => c.id !== selectedContent.id));
      setFilteredContents(filteredContents.filter(c => c.id !== selectedContent.id));
      handleContentAction(selectedContent.id, 'Supprimer');
      console.log(`Content ${selectedContent.id} deleted`);
      closeModal();
    }
  };

  const onBulkPublish = () => {
    setContents(contents.map(c => selectedContentIds.includes(c.id) ? { ...c, status: 'Publiée', lastModified: new Date().toISOString().split('T')[0] } : c));
    setFilteredContents(filteredContents.map(c => selectedContentIds.includes(c.id) ? { ...c, status: 'Publiée', lastModified: new Date().toISOString().split('T')[0] } : c));
    selectedContentIds.forEach(id => handleContentAction(id, 'Publier'));
    console.log(`Bulk published contents:`, selectedContentIds);
    setSelectedContentIds([]);
  };

  const onBulkArchive = () => {
    setContents(contents.map(c => selectedContentIds.includes(c.id) ? { ...c, status: 'Archivée', lastModified: new Date().toISOString().split('T')[0] } : c));
    setFilteredContents(filteredContents.map(c => selectedContentIds.includes(c.id) ? { ...c, status: 'Archivée', lastModified: new Date().toISOString().split('T')[0] } : c));
    selectedContentIds.forEach(id => handleContentAction(id, 'Archiver'));
    console.log(`Bulk archived contents:`, selectedContentIds);
    setSelectedContentIds([]);
  };

  const onBulkDelete = () => {
    setContents(contents.filter(c => !selectedContentIds.includes(c.id)));
    setFilteredContents(filteredContents.filter(c => !selectedContentIds.includes(c.id)));
    selectedContentIds.forEach(id => handleContentAction(id, 'Supprimer'));
    console.log(`Bulk deleted contents:`, selectedContentIds);
    setSelectedContentIds([]);
  };

  const onExportSubmit = (data) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredContents.map(c => `${c.id},${c.title},${c.status},${c.content.replace(/,/g, '')},${c.lastModified}`).join('\n');
      const blob = new Blob([`id,title,status,content,lastModified\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contents_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting contents as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data) => {
    let filtered = [...contents];
    if (data.filterTitle) {
      filtered = filtered.filter(c => c.title.toLowerCase().includes(data.filterTitle.toLowerCase()));
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === data.filterStatus);
    }
    if (data.filterDate) {
      filtered = filtered.filter(c => c.lastModified === data.filterDate);
    }
    setFilteredContents(filtered);
  };

  const sortTable = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredContents].sort((a, b) => {
      const aValue = a[field] || '';
      const bValue = b[field] || '';
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredContents(sorted);
  };

  const toggleSelectContent = (id) => {
    setSelectedContentIds(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedContentIds.length === filteredContents.length) {
      setSelectedContentIds([]);
    } else {
      setSelectedContentIds(filteredContents.map(c => c.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des pages et contenus</h2>
      <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
        <div className="p-4 sm:p-6">
          <h3 className="text-white text-sm sm:text-lg md:text-xl mb-4">Liste des contenus</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <button
              className="bg-green-500 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
              onClick={() => openModal('add')}
              aria-label="Ajouter un contenu"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un contenu
            </button>
            {selectedContentIds.length > 0 && (
              <>
                <button
                  className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
                  onClick={onBulkPublish}
                  aria-label="Publier les contenus sélectionnés"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Publier sélection
                </button>
                <button
                  className="bg-yellow-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
                  onClick={onBulkArchive}
                  aria-label="Archiver les contenus sélectionnés"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Archiver sélection
                </button>
                <button
                  className="bg-red-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
                  onClick={onBulkDelete}
                  aria-label="Supprimer les contenus sélectionnés"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Supprimer sélection
                </button>
              </>
            )}
            <button
              className="bg-yellow-400 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
              onClick={() => openModal('export')}
              aria-label="Exporter les contenus"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
          <form onSubmit={handleSubmit(onFilterSubmit)} className="mb-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Filtrer par titre"
              {...register('filterTitle')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <select
              {...register('filterStatus')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            >
              <option value="all">Tous</option>
              <option value="Publiée">Publiée</option>
              <option value="Brouillon">Brouillon</option>
              <option value="Archivée">Archivée</option>
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
                      checked={selectedContentIds.length === filteredContents.length && filteredContents.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner tous les contenus"
                    />
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('title')}
                  >
                    Titre {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                {filteredContents.map((content) => (
                  <tr key={content.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedContentIds.includes(content.id)}
                        onChange={() => toggleSelectContent(content.id)}
                        aria-label={`Sélectionner le contenu ${content.title}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{content.title}</td>
                    <td className="p-2 sm:p-3">{content.status}</td>
                    <td className="p-2 sm:p-3">{content.lastModified}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <button
                        className="text-white bg-yellow-400 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('view', content)}
                        aria-label={`Voir le contenu ${content.title}`}
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Voir
                      </button>
                      <button
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('edit', content)}
                        aria-label={`Modifier le contenu ${content.title}`}
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Modifier
                      </button>
                      <button
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('delete', content)}
                        aria-label={`Supprimer le contenu ${content.title}`}
                      >
                        <Trash className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Content Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'add' ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Ajouter un contenu</h3>
          <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm">Titre</label>
              <input
                id="title"
                {...register('title', { required: 'Titre requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm">Statut</label>
              <select
                id="status"
                {...register('status', { required: 'Statut requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              >
                <option value="" disabled>Sélectionner un statut</option>
                <option value="Publiée">Publiée</option>
                <option value="Brouillon">Brouillon</option>
                <option value="Archivée">Archivée</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            <div>
              <label htmlFor="content" className="block text-sm">Contenu</label>
              <input
                id="content"
                {...register('content', { required: 'Contenu requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.content && <p className="text-red-500 text-xs">{errors.content.message}</p>}
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

      {/* View Content Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'view' && !!selectedContent ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Voir le contenu</h3>
          <div className="space-y-4">
            {selectedContent ? (
              <>
                <div>
                  <label className="block text-sm">Titre</label>
                  <p className="text-xs sm:text-sm">{selectedContent.title}</p>
                </div>
                <div>
                  <label className="block text-sm">Statut</label>
                  <p className="text-xs sm:text-sm">{selectedContent.status}</p>
                </div>
                <div>
                  <label className="block text-sm">Contenu</label>
                  <p className="text-xs sm:text-sm">{selectedContent.content}</p>
                </div>
                <div>
                  <label className="block text-sm">Dernière modification</label>
                  <p className="text-xs sm:text-sm">{selectedContent.lastModified}</p>
                </div>
              </>
            ) : (
              <p>Aucun contenu sélectionné.</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end mt-4">
            <button className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Fermer</button>
          </div>
        </div>
      </div>

      {/* Edit Content Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'edit' && !!selectedContent ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Modifier le contenu</h3>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm">Titre</label>
              <input
                id="title"
                {...register('title', { required: 'Titre requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm">Statut</label>
              <select
                id="status"
                {...register('status', { required: 'Statut requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              >
                <option value="" disabled>Sélectionner un statut</option>
                <option value="Publiée">Publiée</option>
                <option value="Brouillon">Brouillon</option>
                <option value="Archivée">Archivée</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            <div>
              <label htmlFor="content" className="block text-sm">Contenu</label>
              <input
                id="content"
                {...register('content', { required: 'Contenu requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.content && <p className="text-red-500 text-xs">{errors.content.message}</p>}
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

      {/* Delete Content Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'delete' && !!selectedContent ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Supprimer le contenu</h3>
          <div className="p-4">
            {selectedContent ? (
              <p>Supprimer le contenu "{selectedContent.title}" ?</p>
            ) : (
              <p>Aucun contenu sélectionné.</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
            <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded" onClick={onDeleteSubmit} disabled={!selectedContent}>Confirmer</button>
          </div>
        </div>
      </div>

      {/* Export Contents Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'export' ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Exporter les contenus</h3>
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