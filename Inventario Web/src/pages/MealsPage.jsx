import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddMealForm from '../components/AddMealForm.jsx';
import MealList from '../components/MealList.jsx';
import { getMeals, addMeal, deleteMeal, updateMeal } from '../services/api.js';

// Página principal para gestionar el inventario de comidas.
function MealsPage() {
  const [items, setItems] = useState([]);
  const [itemToEdit, setItemToEdit] = useState(null);

  // Carga las comidas del usuario al montar el componente.
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getMeals();
        setItems(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchItems();
  }, []);

  // Maneja la adición de una nueva comida.
  const handleAddItem = async (itemData) => {
    try {
      const newItem = await addMeal(itemData);
      setItems(prev => [...prev, newItem]);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Maneja la eliminación de una comida.
  const handleDeleteItem = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este item?')) {
      try {
        await deleteMeal(id);
        setItems(items.filter(item => item._id !== id));
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  // Maneja la actualización de una comida.
  const handleUpdateItem = async (id, updatedData) => {
    try {
      const updatedItem = await updateMeal(id, updatedData);
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
      <AddMealForm onAdd={handleAddItem} itemToEdit={itemToEdit} onUpdate={handleUpdateItem} />
      <MealList items={items} onDelete={handleDeleteItem} onEditClick={handleEditClick} />
    </>
  );
}

export default MealsPage;