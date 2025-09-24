// Importa los hooks 'useState' y 'useEffect' de React.
import { useState, useEffect } from 'react';

// Define el componente del formulario para añadir/editar licencias.
function AddLicenseForm({ onAdd, itemToEdit, onUpdate }) {
  // Define estados locales para los campos del formulario.
  const [software, setSoftware] = useState('');
  const [clave, setClave] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');

  // Formatea la fecha para el input type="date"
  const formatDateForInput = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  // Hook que se ejecuta cuando 'itemToEdit' cambia.
  useEffect(() => {
    if (itemToEdit) {
      // Si estamos editando, rellena el formulario con los datos existentes.
      setSoftware(itemToEdit.software || '');
      setClave(itemToEdit.clave || '');
      setFechaExpiracion(formatDateForInput(itemToEdit.fechaExpiracion));
    } else {
      // Si no, resetea el formulario.
      setSoftware('');
      setClave('');
      setFechaExpiracion('');
    }
  }, [itemToEdit]);

  // Maneja el envío del formulario.
  const handleSubmit = (event) => {
    event.preventDefault();
    const licenseData = { software, clave, fechaExpiracion };

    if (itemToEdit) {
      onUpdate(itemToEdit._id, licenseData);
    } else {
      onAdd(licenseData);
      // Resetea el formulario después de añadir.
      setSoftware('');
      setClave('');
      setFechaExpiracion('');
    }
  };

  return (
    <div className="form-container">
      <h2>{itemToEdit ? 'Editando Licencia' : 'Añadir Nueva Licencia'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Software:</label>
          <input type="text" value={software} onChange={(e) => setSoftware(e.target.value)} required />
        </div>
        <div>
          <label>Clave de Producto:</label>
          <input type="text" value={clave} onChange={(e) => setClave(e.target.value)} required />
        </div>
        <div>
          <label>Fecha de Expiración:</label>
          <input type="date" value={fechaExpiracion} onChange={(e) => setFechaExpiracion(e.target.value)} />
        </div>
        <button type="submit">{itemToEdit ? 'Actualizar Licencia' : 'Añadir Licencia'}</button>
      </form>
    </div>
  );
}

export default AddLicenseForm;