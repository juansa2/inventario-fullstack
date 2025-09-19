// src/components/AddProductForm.jsx

import { useState, useEffect } from 'react';

function AddProductForm({ onAddProduct, productToEdit, onUpdateProduct }) {
  const [tipo, setTipo] = useState('Laptop');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [serial, setSerial] = useState(''); // Estado para el serial
  const [usuarioAsignado, setUsuarioAsignado] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setTipo(productToEdit.tipo);
      setMarca(productToEdit.marca);
      setModelo(productToEdit.modelo);
      setSerial(productToEdit.serial);
      setUsuarioAsignado(productToEdit.usuarioAsignado);
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
    // ¡Asegúrate de que 'serial' esté incluido en este objeto!
    const computerData = { tipo, marca, modelo, serial, usuarioAsignado };

    if (productToEdit) {
      onUpdateProduct(productToEdit._id, computerData);
    } else {
      onAddProduct(computerData);
    }
    
    // El formulario no se limpia aquí, se limpia en App.jsx o por el useEffect
  };

  return (
    <div className="form-container">
      <h2>{productToEdit ? 'Editando Equipo' : 'Añadir Nuevo Equipo'}</h2>
      <form onSubmit={handleSubmit}>
        {/* ... otros campos ... */}
        <div>
          <label>Serial:</label>
          <input type="text" value={serial} onChange={(e) => setSerial(e.target.value)} required />
        </div>
        <div>
          <label>Usuario Asignado:</label>
          <input type="text" value={usuarioAsignado} onChange={(e) => setUsuarioAsignado(e.target.value)} />
        </div>
        <button type="submit">
          {productToEdit ? 'Actualizar Equipo' : 'Añadir Equipo'}
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;