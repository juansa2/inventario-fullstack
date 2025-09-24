// Importa los hooks 'useState' y 'useEffect' de React.
import { useState, useEffect } from 'react';

// Define el componente del formulario para añadir/editar ingredientes.
function AddIngredientForm({ onAdd, itemToEdit, onUpdate }) {
  // Define estados locales para los campos del formulario.
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('');

  // Hook que se ejecuta cuando 'itemToEdit' cambia.
  useEffect(() => {
    if (itemToEdit) {
      // Si estamos editando, rellena el formulario con los datos existentes.
      setNombre(itemToEdit.nombre || '');
      setCantidad(itemToEdit.cantidad || '');
      setUnidad(itemToEdit.unidad || '');
    } else {
      // Si no, resetea el formulario.
      setNombre('');
      setCantidad('');
      setUnidad('');
    }
  }, [itemToEdit]);

  // Maneja el envío del formulario.
  const handleSubmit = (event) => {
    event.preventDefault();
    const ingredientData = { nombre, cantidad: Number(cantidad), unidad };

    if (itemToEdit) {
      onUpdate(itemToEdit._id, ingredientData);
    } else {
      onAdd(ingredientData);
      // Resetea el formulario después de añadir.
      setNombre('');
      setCantidad('');
      setUnidad('');
    }
  };

  return (
    <div className="form-container">
      <h2>{itemToEdit ? 'Editando Ingrediente' : 'Añadir Nuevo Ingrediente'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Cantidad:</label>
          <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
        </div>
        <div>
          <label>Unidad (ej: kg, litros, uds):</label>
          <input type="text" value={unidad} onChange={(e) => setUnidad(e.target.value)} required />
        </div>
        <button type="submit">{itemToEdit ? 'Actualizar Ingrediente' : 'Añadir Ingrediente'}</button>
      </form>
    </div>
  );
}

export default AddIngredientForm;