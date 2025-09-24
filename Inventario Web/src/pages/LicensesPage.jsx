import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddLicenseForm from '../components/AddLicenseForm.jsx';
import LicenseList from '../components/LicenseList.jsx';
import { getLicenses, addLicense, deleteLicense, updateLicense } from '../services/api.js';

// Página principal para gestionar el inventario de licencias.
function LicensesPage() {
  const [items, setItems] = useState([]);
  const [itemToEdit, setItemToEdit] = useState(null);

  // Carga las licencias del usuario al montar el componente.
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getLicenses();
        setItems(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchItems();
  }, []);

  // Maneja la adición de una nueva licencia.
  const handleAddItem = async (itemData) => {
    try {
      const newItem = await addLicense(itemData);
      setItems(prev => [...prev, newItem]);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Maneja la eliminación de una licencia.
  const handleDeleteItem = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta licencia?')) {
      try {
        await deleteLicense(id);
        setItems(items.filter(item => item._id !== id));
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  // Maneja la actualización de una licencia.
  const handleUpdateItem = async (id, updatedData) => {
    try {
      const updatedItem = await updateLicense(id, updatedData);
      setItems(items.map(item => (item._id === id ? updatedItem : item)));
      setItemToEdit(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Prepara el formulario para la edición.
  const handleEditClick = (item) => {
    setItemToEdit(item);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Link to="/inventory" className="back-to-menu">{"< Volver al Menú"}</Link>
      <AddLicenseForm onAdd={handleAddItem} itemToEdit={itemToEdit} onUpdate={handleUpdateItem} />
      <LicenseList items={items} onDelete={handleDeleteItem} onEditClick={handleEditClick} />
    </>
  );
}

export default LicensesPage;