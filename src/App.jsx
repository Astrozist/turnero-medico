import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
const API_URL = 'https://68588aee138a18086dfb32a1.mockapi.io/turnos';

// Especialidades
const ESPECIALIDADES = {
  'Psiquiatra': ['Dr Nicolás Plavnik'],
  'Psicólogo': ['Dr Mateo Silvera'],
  'Traumatólogo': ['Dr Esteban Quito'],
  'Atención de guardia': ['Dra Zohe Aylén Caballero', 'Ramiro Percy'],
  'Otorrino': ['Dr Mateo ubuntu'],
  'Oculista': ['Dra Rossana Chahla']
};

function App() {
  // Formulario
  const [especialidad, setEspecialidad] = useState('');
  const [medico, setMedico] = useState('');
  const [paciente, setPaciente] = useState('');
  const [fecha, setFecha] = useState('');
  const [turnos, setTurnos] = useState([]);
  const [editandoTurnoId, setEditandoTurnoId] = useState(null);

  function limpiarFormulario() {
    setEspecialidad('');
    setMedico('');
    setPaciente('');
    setFecha('');
    setEditandoTurnoId(null);
  }

  useEffect(() => {
    fetch(API_URL)
      .then((respuesta) => respuesta.json())
      .then((datos) => setTurnos(datos))
  }, []);

  function enviarFormulario(event) {
    event.preventDefault();

    const turno = {
      especialidad,
      medico,
      paciente,
      fecha
    };

    // Agarra de la API datos
    if (editandoTurnoId) {
      fetch(`${API_URL}/${editandoTurnoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(turno)
      })
        .then((res) => res.json())
        .then((turnoActualizado) => {
          const listaActualizada = turnos.map((t) =>
            t.id === editandoTurnoId ? turnoActualizado : t
          );
          setTurnos(listaActualizada);
          limpiarFormulario();
        });
    } else {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(turno)
      })
        .then((res) => res.json())
        .then((nuevoTurno) => {
          setTurnos([...turnos, nuevoTurno]);
          limpiarFormulario();
        });
    }
  }

  // Editar
  function editarTurno(id) {
    const turno = turnos.find((t) => t.id === id);
    if (turno) {
      setEspecialidad(turno.especialidad);
      setMedico(turno.medico);
      setPaciente(turno.paciente);
      setFecha(turno.fecha);
      setEditandoTurnoId(turno.id);
    }
  }

  // Eliminar
  function eliminarTurno(id) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => {
        const nuevosTurnos = turnos.filter((t) => t.id !== id);
        setTurnos(nuevosTurnos);
        if (editandoTurnoId === id) limpiarFormulario();
      });
  }
  const medicosDisponibles = especialidad ? ESPECIALIDADES[especialidad] : [];

  return (
    <div className="container mt-4">
      <h2>Turnos Médicos</h2>

      <form onSubmit={enviarFormulario} className="card p-4 my-4">
        <div className="mb-3">
          <label>Especialidad</label>
          <select
            className="form-select"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            required
          >
            <option value="">Escoge una</option>
            {Object.keys(ESPECIALIDADES).map((esp) => (
              <option key={esp} value={esp}>{esp}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Médico</label>
          <select
            className="form-select"
            value={medico}
            onChange={(e) => setMedico(e.target.value)}
            disabled={!especialidad}
            required
          >
            <option value="">Escoge un médico</option>
            {medicosDisponibles.map((doc) => (
              <option key={doc} value={doc}>{doc}</option>
            ))}
          </select>
        </div>


        <div className="mb-3">
          <label>Nombre y Apellido del Paciente</label>
          <input
            className="form-control"
            type="text"
            value={paciente}
            onChange={(e) => setPaciente(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Fecha del Turno</label>
          <input
            className="form-control"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">
          {editandoTurnoId ? 'Aceptar' : 'Agregar'}
        </button>

        {editandoTurnoId && (
          <button type="button" className="btn btn-secondary" onClick={limpiarFormulario}>
            Cancelar
          </button>
        )}
      </form>

      <h4>Turnos registrados</h4>
      <table className="table table-striped">
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
                <button className="btn btn-warning btn-sm me-2" onClick={() => editarTurno(t.id)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarTurno(t.id)}>
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
