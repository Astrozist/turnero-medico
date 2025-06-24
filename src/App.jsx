import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ESPECIALIDADES = {
  'Gastroenterología': ['Dr. Aguilar Marcelo'],
  'Cardiología': ['Dr. Eduardo Pino'],
  'Dermatología': ['Claudia Zamora'],
  'Clínica Médica': ['Dr. Aguilar Marcelo', 'Claudia Zamora'],
  'Oftalmología': ['Dr. Eduardo Pino'],
  'Neumonología': ['Dr. Aguilar Marcelo']
};

const API_URL = 'https://68588aee138a18086dfb32a1.mockapi.io/turnos';

function App() {
  const [especialidad, setEspecialidad] = useState('');
  const [medico, setMedico] = useState('');
  const [paciente, setPaciente] = useState('');
  const [fecha, setFecha] = useState('');
  const [turnos, setTurnos] = useState([]);
  const [editId, setEditId] = useState(null);

  const resetFormulario = () => {
    setEspecialidad('');
    setMedico('');
    setPaciente('');
    setFecha('');
    setEditId(null);
  };

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTurnos(data))
      .catch(err => console.error('Error cargando turnos:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoTurno = { especialidad, medico, paciente, fecha };

    try {
      if (editId) {
        const res = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoTurno)
        });
        const data = await res.json();
        setTurnos(turnos.map(t => t.id === editId ? data : t));
      } else {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoTurno)
        });
        const data = await res.json();
        setTurnos([...turnos, data]);
      }
      resetFormulario();
    } catch (err) {
      console.error('Error guardando turno:', err);
    }
  };

  const handleEdit = (id) => {
    const turno = turnos.find(t => t.id === id);
    if (turno) {
      setEspecialidad(turno.especialidad);
      setMedico(turno.medico);
      setPaciente(turno.paciente);
      setFecha(turno.fecha);
      setEditId(turno.id);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTurnos(turnos.filter(t => t.id !== id));
      if (editId === id) resetFormulario();
    } catch (err) {
      console.error('Error eliminando turno:', err);
    }
  };

  const handleCancel = () => {
    resetFormulario();
  };

  const medicosOpciones = especialidad ? ESPECIALIDADES[especialidad] : [];

  return (
    <div className="container mt-5">
      <h2>Gestión de Turnos Médicos</h2>
      <form onSubmit={handleSubmit} className="card p-4 mb-4">
        <div className="mb-3">
          <label className="form-label">Especialidad</label>
          <select
            className="form-select"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            required
          >
            <option value="">Seleccione una especialidad</option>
            {Object.keys(ESPECIALIDADES).map((esp) => (
              <option key={esp} value={esp}>{esp}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Médico</label>
          <select
            className="form-select"
            value={medico}
            onChange={(e) => setMedico(e.target.value)}
            required
            disabled={!especialidad}
          >
            <option value="">Seleccione un médico</option>
            {medicosOpciones.map((doc) => (
              <option key={doc} value={doc}>{doc}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Nombre y Apellido</label>
          <input
            type="text"
            className="form-control"
            value={paciente}
            onChange={(e) => setPaciente(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha del Turno</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>

        <div className="d-flex">
          <button type="submit" className="btn btn-primary me-2">
            {editId ? 'Aceptar' : 'Agregar'}
          </button>
          {editId && (
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3>Listado de Turnos</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Especialidad</th>
            <th>Médico</th>
            <th>Paciente</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((t) => (
            <tr key={t.id}>
              <td>{t.especialidad}</td>
              <td>{t.medico}</td>
              <td>{t.paciente}</td>
              <td>{t.fecha}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(t.id)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(t.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
