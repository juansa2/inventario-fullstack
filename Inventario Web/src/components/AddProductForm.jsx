// Importa los hooks 'useState' y 'useEffect' de React para manejar el estado y los efectos secundarios.
import { useState, useEffect } from 'react';

// Define el componente del formulario, que recibe props para manejar la adición y actualización de productos.
function AddProductForm({ onAddProduct, productToEdit, onUpdateProduct }) {
  // Define estados locales para cada campo del formulario.
  const [tipo, setTipo] = useState('Laptop');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [serial, setSerial] = useState('');
  const [usuarioAsignado, setUsuarioAsignado] = useState('');

  // Hook 'useEffect' que se ejecuta cuando la prop 'productToEdit' cambia.
  useEffect(() => {
    // Si 'productToEdit' tiene un valor (estamos en modo edición)...
    if (productToEdit) {
      // ...rellena los campos del formulario con los datos del producto a editar.
      setTipo(productToEdit.tipo || 'Laptop');
      setMarca(productToEdit.marca || '');
      setModelo(productToEdit.modelo || '');
      setSerial(productToEdit.serial || '');
      setUsuarioAsignado(productToEdit.usuarioAsignado || '');
    } else {
      // Si 'productToEdit' es nulo (estamos en modo añadir), resetea los campos a sus valores iniciales.
      setTipo('Laptop');
      setMarca('');
      setModelo('');
      setSerial('');
      setUsuarioAsignado('');
    }
  }, [productToEdit]); // El efecto depende de 'productToEdit'.

  // Define la función que se ejecuta al enviar el formulario.
  const handleSubmit = (event) => {
    // Previene el comportamiento por defecto del formulario (recargar la página).
    event.preventDefault();
    // Agrupa los datos del estado en un objeto.
    const computerData = { tipo, marca, modelo, serial, usuarioAsignado };

    // Si estamos en modo edición...
    if (productToEdit) {
      // ...llama a la función 'onUpdateProduct' pasada por props con el ID y los nuevos datos.
      onUpdateProduct(productToEdit._id, computerData);
    } else {
      // Si estamos en modo añadir, llama a la función 'onAddProduct' con los datos del nuevo equipo.
      onAddProduct(computerData);
      // Resetea los campos del formulario después de añadir.
      setTipo('Laptop');
      setMarca('');
      setModelo('');
      setSerial('');
      setUsuarioAsignado('');
    }
  };

  // Renderiza el JSX del componente.
  return (
    <div className="form-container">
      {/* El título del formulario cambia dinámicamente dependiendo de si se está editando o añadiendo. */}
      <h2>{productToEdit ? 'Editando Equipo' : 'Añadir Nuevo Equipo'}</h2>
      {/* Asocia la función 'handleSubmit' al evento 'onSubmit' del formulario. */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tipo:</label>
          {/* Campo 'select' para el tipo de equipo. Su valor y cambio están controlados por el estado 'tipo'. */}
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
            <option value="Laptop">Laptop</option>
            <option value="Desktop">Desktop</option>
            <option value="Servidor">Servidor</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        {/* Campos de texto para el resto de los datos. Cada uno está vinculado a su respectivo estado. */}
        <div><label>Marca:</label><input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} required /></div>
        <div><label>Modelo:</label><input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} required /></div>
        <div><label>Serial:</label><input type="text" value={serial} onChange={(e) => setSerial(e.target.value)} required /></div>
        <div><label>Usuario Asignado:</label><input type="text" value={usuarioAsignado} onChange={(e) => setUsuarioAsignado(e.target.value)} /></div>
        {/* El texto del botón también cambia según el modo (editar o añadir). */}
        <button type="submit">{productToEdit ? 'Actualizar Equipo' : 'Añadir Equipo'}</button>
      </form>
    </div>
  );
}
// Exporta el componente para ser usado en otras partes de la aplicación.
export default AddProductForm;