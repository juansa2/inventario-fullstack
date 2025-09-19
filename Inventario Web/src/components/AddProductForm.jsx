import { useState, useEffect } from 'react';

function AddProductForm({ onAddProduct, productToEdit, onUpdateProduct }) {
  const [tipo, setTipo] = useState('Laptop');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [serial, setSerial] = useState('');
  const [usuarioAsignado, setUsuarioAsignado] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setTipo(productToEdit.tipo || 'Laptop');
      setMarca(productToEdit.marca || '');
      setModelo(productToEdit.modelo || '');
      setSerial(productToEdit.serial || '');
      setUsuarioAsignado(productToEdit.usuarioAsignado || '');
    } else {
      setTipo('Laptop');
      setMarca('');
      setModelo('');
      setSerial('');
      setUsuarioAsignado('');
    }
  }, [productToEdit]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const computerData = { tipo, marca, modelo, serial, usuarioAsignado };

    if (productToEdit) {
      onUpdateProduct(productToEdit._id, computerData);
    } else {
      onAddProduct(computerData);
    }
      // limpiar manualmente después de añadir un nuevo equipo.
    if (!productToEdit) {
      setTipo('Laptop');
      setMarca('');
      setModelo('');
      setSerial('');
      setUsuarioAsignado('');
    }
  };

  return (
    <div className="form-container">
      <h2>{productToEdit ? 'Editando Equipo' : 'Añadir Nuevo Equipo'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tipo:</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
            <option value="Laptop">Laptop</option>
            <option value="Desktop">Desktop</option>
            <option value="Servidor">Servidor</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div><label>Marca:</label><input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} required /></div>
        <div><label>Modelo:</label><input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} required /></div>
        <div><label>Serial:</label><input type="text" value={serial} onChange={(e) => setSerial(e.target.value)} required /></div>
        <div><label>Usuario Asignado:</label><input type="text" value={usuarioAsignado} onChange={(e) => setUsuarioAsignado(e.target.value)} /></div>
        <button type="submit">{productToEdit ? 'Actualizar Equipo' : 'Añadir Equipo'}</button>
      </form>
    </div>
  );
}
export default AddProductForm;