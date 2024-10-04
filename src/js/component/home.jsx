import React, { useState, useEffect } from "react";

const crearUsuario = () => {
  return fetch('https://playground.4geeks.com/todo/users/juanrulu', {
    method: 'POST',
    body: JSON.stringify([]),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log("Usuario creado");
      } else {
        console.log("Error en la creación del usuario");
      }
    })
    .catch((error) => console.error("Error en la creación del usuario:", error));
};

const leerUsuario = () => {
  return fetch("https://playground.4geeks.com/todo/users/juanrulu")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("Usuario no encontrado");
        return [];
      }
    })
    .then((data) => (data.todos ? data.todos : []))
    .catch((error) => {
      console.error("Error al leer usuario:", error);
      return [];
    });
};

const eliminarUsuario = () => {
  return fetch("https://playground.4geeks.com/todo/users/juanrulu", {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        console.log("Usuario eliminado");
      } else {
        console.log("Error al eliminar el usuario");
      }
    })
    .catch((error) => console.error("Error al eliminar usuario:", error));
};

const Home = () => {
  const [newEntry, setNewEntry] = useState('');
  const [toDoList, setToDoList] = useState([]);
  const conteo = toDoList.length;

  const crearToDo = (task) => {
    fetch('https://playground.4geeks.com/todo/todos/juanrulu', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ label: task, is_done: false }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('Error al crear la tarea');
        }
      })
      .then((data) => {
        if (data) {
          const nuevaLista = [...toDoList, { id: data.id, label: task }];
          setToDoList(nuevaLista);
        }
      })
      .catch((error) => console.error('Error al crear ToDo:', error));
  };

  const eliminarToDo = (id) => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          const nuevaLista = toDoList.filter((task) => task.id !== id);
          setToDoList(nuevaLista);
        } else {
          console.log('Error al eliminar el ToDo');
        }
      })
      .catch((error) => console.error('Error al eliminar ToDo:', error));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (newEntry.trim() === '') return;
    crearToDo(newEntry);
    setNewEntry('');
  };

  const eliminarElemento = (id) => {
    const task = toDoList[id];
    eliminarToDo(task.id);
  };

  const clearToDoList = () => {
    toDoList.forEach((task) => eliminarToDo(task.id));
    setToDoList([]);
  };

  useEffect(() => {
    leerUsuario()
      .then((tasks) => setToDoList(tasks))
      .catch((error) => console.error("Error al cargar las tareas", error));
  }, []);

  useEffect(() => {
    crearUsuario();
  }, []);

  return (
    <div className="container p-4 bg-light shadow-sm rounded">
      <h2 className="text-center text-primary mb-4 display-6">Gestión de Tareas API</h2>
      
      <div className="card border-0 shadow-sm p-4 bg-white">
        <form onSubmit={onSubmit}>
          <div className="input-group mb-3">
            <input
              onChange={(e) => setNewEntry(e.target.value)}
              value={newEntry}
              type="text"
              className="form-control form-control-lg"
              placeholder="Escribe una nueva tarea..."
            />
            <button type="submit" className="btn btn-outline-success input-group-text">
              Añadir
            </button>
          </div>
        </form>

        <ul className="list-group">
          {toDoList.length === 0 ? (
            <li className="list-group-item text-center text-muted">
              No hay tareas pendientes
            </li>
          ) : (
            toDoList.map((task, idx) => (
              <li
                key={idx}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{ padding: "15px 10px", fontSize: "18px" }}
              >
                {task.label}
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => eliminarElemento(idx)}
                >
                  Eliminar
                </button>
              </li>
            ))
          )}
        </ul>

        {toDoList.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-muted">Tareas pendientes: {conteo}</span>
            <button className="btn btn-outline-danger" onClick={clearToDoList}>
              Limpiar todo
            </button>
          </div>
        )}

        <div className="mt-4">
          <button className="btn btn-danger" onClick={eliminarUsuario}>
            Eliminar Usuario y Reiniciar
          </button>
        </div>
      </div>
    </div>
  );  
};

export default Home;
