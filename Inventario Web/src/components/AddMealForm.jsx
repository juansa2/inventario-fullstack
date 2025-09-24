// Importa los hooks 'useState' y 'useEffect' de React.
import { useState, useEffect } from 'react';

// Define el componente del formulario para añadir/editar comidas.
function AddMealForm({ onAdd, itemToEdit, onUpdate }) {
  // Define estados locales para los campos del formulario.
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  // Hook que se ejecuta cuando 'itemToEdit' cambia.
  useEffect(() => {
    if (itemToEdit) {
      // Si estamos editando, rellena el formulario con los datos existentes.
      setNombre(itemToEdit.nombre || '');
      setDescripcion(itemToEdit.descripcion || '');
      setPrecio(itemToEdit.precio || '');
    } else {
      // Si no, resetea el formulario.
      setNombre('');
      setDescripcion('');
      setPrecio('');
    }
  }, [itemToEdit]);

  // Maneja el envío del formulario.
  const handleSubmit = (event) => {
    event.preventDefault();
    const mealData = { nombre, descripcion, precio: Number(precio) };

    if (itemToEdit) {
      onUpdate(itemToEdit._id, mealData);
    } else {
      onAdd(mealData);
      // Resetea el formulario después de añadir.
      setNombre('');
      setDescripcion('');
      setPrecio('');
    }
  };

  return (
    <div className="form-container">
      <h2>{itemToEdit ? 'Editando Comida' : 'Añadir Nueva Comida'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Descripción:</label>
          <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <div>
          <label>Precio:</label>
          <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
        </div>
        <button type="submit">{itemToEdit ? 'Actualizar Comida' : 'Añadir Comida'}</button>
      </form>
    </div>
  );
}

export default AddMealForm;