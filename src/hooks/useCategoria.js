import { useState, useCallback } from 'react';
import { useToast } from '../context/ToastContext';

// Cambiar puerto a 5000 si mantienes el puerto original
const API =  import.meta.env.VITE_API_URL
const API_URL = `${API}/api/categorias` || 'http://localhost:10000/api/categorias';
const HEALTH_URL = `${API}/health` || 'http://localhost:10000/health';

export default function useCategoria() {
  const [form, setForm] = useState({
    nombre: '',
    hora_salida: ''
  });
  
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
  
  const { showSuccess, showError } = useToast();

  // Manejar cambios en el formulario
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setForm({
      nombre: '',
      hora_salida: ''
    });
    setEditingCategoria(null);
  }, []);

  // Obtener todas las categorías
  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    try {
      // Verificar si el servidor está disponible primero
      await fetch(HEALTH_URL);
      
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCategorias(data.data);
      } else {
        showError(data.message || 'Error al cargar las categorías');
      }
    } catch (error) {
      showError(`Error de conexión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Crear nueva categoría
  const createCategoria = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (data.success) {
        showSuccess(data.message || 'Categoría creada exitosamente');
        await fetchCategorias(); // Recargar la lista
        resetForm();
        setModalOpen(false);
      } else {
        showError(data.message || 'Error al crear la categoría');
      }
    } catch (error) {
      showError('Error de conexión al crear la categoría');
    } finally {
      setLoading(false);
    }
  }, [form, showSuccess, showError, fetchCategorias, resetForm]);

  // Actualizar categoría existente
  const updateCategoria = useCallback(async () => {
    if (!editingCategoria) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${editingCategoria.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (data.success) {
        showSuccess(data.message || 'Categoría actualizada exitosamente');
        await fetchCategorias(); // Recargar la lista
        resetForm();
        setModalOpen(false);
      } else {
        showError(data.message || 'Error al actualizar la categoría');
      }
    } catch (error) {
      showError('Error de conexión al actualizar la categoría');
    } finally {
      setLoading(false);
    }
  }, [editingCategoria, form, showSuccess, showError, fetchCategorias, resetForm]);

  // Eliminar categoría
  const deleteCategoria = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        showSuccess(data.message || 'Categoría eliminada exitosamente');
        await fetchCategorias(); // Recargar la lista
        setDeleteModalOpen(false);
        setCategoriaToDelete(null);
      } else {
        showError(data.message || 'Error al eliminar la categoría');
      }
    } catch (error) {
      showError('Error de conexión al eliminar la categoría');
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError, fetchCategorias]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!form.nombre.trim() || !form.hora_salida.trim()) {
      showError('Por favor complete todos los campos');
      return;
    }
    
    if (editingCategoria) {
      await updateCategoria();
    } else {
      await createCategoria();
    }
  }, [form, editingCategoria, updateCategoria, createCategoria, showError]);

  // Abrir modal para crear nueva categoría
  const openCreateModal = useCallback(() => {
    resetForm();
    setModalOpen(true);
  }, [resetForm]);

  // Abrir modal para editar categoría
  const openEditModal = useCallback((categoria) => {
    setForm({
      nombre: categoria.nombre,
      hora_salida: categoria.hora_salida
    });
    setEditingCategoria(categoria);
    setModalOpen(true);
  }, []);

  // Cerrar modal
  const closeModal = useCallback(() => {
    setModalOpen(false);
    resetForm();
  }, [resetForm]);

  // Abrir modal de confirmación de eliminación
  const openDeleteModal = useCallback((categoria) => {
    setCategoriaToDelete(categoria);
    setDeleteModalOpen(true);
  }, []);

  // Cerrar modal de confirmación de eliminación
  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setCategoriaToDelete(null);
  }, []);

  // Confirmar eliminación
  const confirmDelete = useCallback(() => {
    if (categoriaToDelete) {
      deleteCategoria(categoriaToDelete.id);
    }
  }, [categoriaToDelete, deleteCategoria]);

  return {
    // Estado del formulario
    form,
    handleChange,
    handleSubmit,
    resetForm,
    
    // Estado de la lista
    categorias,
    loading,
    fetchCategorias,
    
    // Estado de modales
    modalOpen,
    editingCategoria,
    deleteModalOpen,
    categoriaToDelete,
    
    // Funciones para modales
    openCreateModal,
    openEditModal,
    closeModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  };
}