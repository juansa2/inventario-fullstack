import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddIngredientForm from '../components/AddIngredientForm.jsx';
import IngredientList from '../components/IngredientList.jsx';
import { getIngredients, addIngredient, deleteIngredient, updateIngredient } from '../services/api.js';

// Página principal para gestionar el inventario de ingredientes.
function IngredientsPage() {
  const [items, setItems] = useState([]);
  const [itemToEdit, setItemToEdit] = useState(null);

  // Carga los ingredientes del usuario al montar el componente.
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getIngredients();
        setItems(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchItems();
  }, []);

  // Maneja la adición de un nuevo ingrediente.
  const handleAddItem = async (itemData) => {
    try {
      const newItem = await addIngredient(itemData);
      setItems(prev => [...prev, newItem]);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Maneja la eliminación de un ingrediente.
  const handleDeleteItem = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ingrediente?')) {
      try {
        await deleteIngredient(id);
        setItems(items.filter(item => item._id !== id));
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  // Maneja la actualización de un ingrediente.
  const handleUpdateItem = async (id, updatedData) => {
    try {
      const updatedItem = await updateIngredient(id, updatedData);
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
      <AddIngredientForm onAdd={handleAddItem} itemToEdit={itemToEdit} onUpdate={handleUpdateItem} />
      <IngredientList items={items} onDelete={handleDeleteItem} onEditClick={handleEditClick} />
    </>
  );
}

export default IngredientsPage;