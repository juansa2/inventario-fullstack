// Formatea la fecha para mostrarla en un formato legible.
const formatDate = (dateString) => {
  if (!dateString) return 'No expira';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Define el componente que muestra la lista de licencias.
function LicenseList({ items, onDelete, onEditClick }) {
  return (
    <div className="product-list-container">
      <h2>Lista de Licencias</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Software</th>
            <th>Clave</th>
            <th>Fecha de Expiración</th>
            <th className="cell-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              <td data-label="Software">{item.software}</td>
              <td data-label="Clave">{item.clave}</td>
              <td data-label="Expiración">{formatDate(item.fechaExpiracion)}</td>
              <td data-label="Acciones">
                <div className="product-actions">
                  <button onClick={() => onEditClick(item)} className="edit-button">
                    Editar
                  </button>
                  <button onClick={() => onDelete(item._id)} className="delete-button">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LicenseList;