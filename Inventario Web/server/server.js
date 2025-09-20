// --- Middleware de Seguridad para Rutas de Inventario ---
// A partir de aquí, todas las rutas a /api/products requerirán un token válido.
app.use('/api/products', authMiddleware);

// --- Rutas Protegidas (Inventario) ---

// POST: Añadir un nuevo equipo (asigna el dueño automáticamente)
app.post('/api/products', async (req, res) => {
  try {
    const newComputer = new Computer({
      ...req.body,
      user: req.user.userId
    });
    await newComputer.save();
    res.status(201).json({ message: 'Equipo guardado', product: newComputer });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el equipo', error: error.message });
  }
});

// GET: Obtener solo los equipos del usuario logueado
app.get('/api/products', async (req, res) => {
  try {
    // AQUÍ ESTÁ LA RUTA GET QUE BUSCAS, YA CORREGIDA:
    const computers = await Computer.find({ user: req.user.userId });
    res.json(computers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los equipos' });
  }
});

// DELETE: Eliminar un equipo (solo si le pertenece al usuario)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedComputer = await Computer.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!deletedComputer) return res.status(404).json({ message: 'Equipo no encontrado o no autorizado' });
    res.json({ message: 'Equipo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el equipo' });
  }
});

// PUT: Actualizar un equipo (solo si le pertenece al usuario)
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedData = req.body;
    const updatedComputer = await Computer.findOneAndUpdate({ _id: req.params.id, user: req.user.userId }, updatedData, { new: true });
    if (!updatedComputer) return res.status(404).json({ message: 'Equipo no encontrado o no autorizado' });
    res.json({ message: 'Equipo actualizado exitosamente', product: updatedComputer });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el equipo' });
  }
});