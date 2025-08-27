import { useState, useEffect } from "react";
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const API_BASE_URL = 'http://localhost:10000';

export default function useInscripcionForm() {
  const [form, setForm] = useState({
    nombre: "", 
    apellidos: "", 
    ci: "", 
    fecha_nacimiento: "", 
    dorsal: "",
    categoria_id: "", 
    equipo: "", 
    metodo_pago: "", 
    comunidad: "",
    comprobante: null,
    foto_anverso: null,
    foto_reverso: null
  });

  const [categorias, setCategorias] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const [categoriasRes, equiposRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/inscripciones/categorias`, { headers }),
        axios.get(`${API_BASE_URL}/api/inscripciones/equipos`, { headers })
      ]);

      setCategorias(categoriasRes.data.categorias || []);
      setEquipos(equiposRes.data.equipos || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      showError('Error cargando categorías y equipos');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'comprobante' || name === 'foto_anverso' || name === 'foto_reverso') {
      const file = files[0];
      if (file) {
        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
          showError('El archivo no debe superar 5MB');
          return;
        }
        
        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
          showError('Solo se permiten archivos JPG, PNG o PDF');
          return;
        }
      }
      setForm(prev => ({ ...prev, [name]: file }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const uploadArchivos = async (ci, files) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Agregar CI para identificar los archivos
      formData.append('ci', ci);
      
      // Agregar archivos si existen
      if (files.comprobante) {
        formData.append('comprobante', files.comprobante);
      }
      if (files.foto_anverso) {
        formData.append('foto_anverso', files.foto_anverso);
      }
      if (files.foto_reverso) {
        formData.append('foto_reverso', files.foto_reverso);
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/inscripciones/upload-archivos`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return { paths: response.data.paths, error: null };
    } catch (error) {
      return { 
        paths: null, 
        error: error.response?.data?.error || 'Error subiendo archivos' 
      };
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar campos requeridos
      if (!form.nombre || !form.apellidos || !form.ci || !form.fecha_nacimiento || 
          !form.dorsal || !form.categoria_id || !form.metodo_pago || !form.comunidad) {
        showError('Faltan campos requeridos');
        setLoading(false);
        return;
      }

      // Validar edad
      const age = calculateAge(form.fecha_nacimiento);
      if (age < 16) {
        showError('Debe ser mayor de 16 años para participar');
        setLoading(false);
        return;
      }

      let comprobante_url = null;
      let foto_anverso_url = null;
      let foto_reverso_url = null;

      // Subir archivos si existen
      const filesToUpload = {};
      if (form.comprobante && form.comprobante.size > 0) {
        filesToUpload.comprobante = form.comprobante;
      }
      if (form.foto_anverso && form.foto_anverso.size > 0) {
        filesToUpload.foto_anverso = form.foto_anverso;
      }
      if (form.foto_reverso && form.foto_reverso.size > 0) {
        filesToUpload.foto_reverso = form.foto_reverso;
      }

      if (Object.keys(filesToUpload).length > 0) {
        const { paths, error } = await uploadArchivos(form.ci, filesToUpload);
        if (error) {
          showError(error);
          setLoading(false);
          return;
        }
        
        comprobante_url = paths.comprobante || null;
        foto_anverso_url = paths.foto_anverso || null;
        foto_reverso_url = paths.foto_reverso || null;
      }

      // Crear participante
      const token = localStorage.getItem('token');
      const participanteData = {
        nombre: form.nombre,
        apellidos: form.apellidos,
        ci: form.ci,
        fecha_nacimiento: form.fecha_nacimiento,
        dorsal: form.dorsal,
        categoria_id: form.categoria_id,
        equipo: form.equipo || null,
        metodo_pago: form.metodo_pago,
        comunidad: form.comunidad,
        comprobante_url: comprobante_url,
        foto_anverso_url: foto_anverso_url,
        foto_reverso_url: foto_reverso_url
      };

      await axios.post(
        `${API_BASE_URL}/api/inscripciones/participantes`,
        participanteData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Éxito
      showSuccess(`Participante ${form.nombre} ${form.apellidos} registrado correctamente`);
      
      // Limpiar formulario
      setForm({
        nombre: "", 
        apellidos: "", 
        ci: "", 
        fecha_nacimiento: "", 
        dorsal: "",
        categoria_id: "", 
        equipo: "", 
        metodo_pago: "", 
        comunidad: "",
        comprobante: null,
        foto_anverso: null,
        foto_reverso: null
      });

      // Resetear los inputs file
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => input.value = '');

    } catch (error) {
      console.error('Error registrando participante:', error);
      const errorMessage = error.response?.data?.error || 'Error registrando participante';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { 
    form, 
    categorias, 
    equipos, 
    loading, 
    handleChange, 
    handleSubmit,
    calculateAge
  };
}