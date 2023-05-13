let DB;
// Campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

// Variable para edicion
let edicion = false;

window.onload = () => {
    eventListener();
    crearDB();
}

// Eventos del proyecto
function eventListener() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

// Objeto principal donde se almacenará la información y nos permitirá validar campos
const objCita = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// Función principal de agendar la cita
function datosCita(e) {

    objCita[e.target.name] = e.target.value;
    // console.log(objCita);
}

class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
        // console.log(this.citas);
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        // Crear el div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar clase dependiendo de la alerta
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        // Agregando el contenido del mensaje
        divMensaje.textContent = mensaje;
        // Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Quitar la alerta después de 3 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }


    imprimirCitas() { //Estoy haciendo destructuring dentro del arreglo de objetos
        // Limpiar HTML
        this.limpiarHTML();

        const objectStore = DB.transaction('citas').objectStore('citas');

        objectStore.openCursor().onsuccess = function (e) {
            const cursor = e.target.result;

            if (cursor) {
                const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cursor.value;

                const divCita = document.createElement('div');
                divCita.classList.add('cita', 'p-3');
                divCita.dataset.id = id;

                // scRIPTING DE LOS ELEMENTOS...
                const mascotaParrafo = document.createElement('h2');
                mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
                mascotaParrafo.innerHTML = `${mascota}`;

                const propietarioParrafo = document.createElement('p');
                propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`;

                const telefonoParrafo = document.createElement('p');
                telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: </span> ${telefono}`;

                const fechaParrafo = document.createElement('p');
                fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

                const horaParrafo = document.createElement('p');
                horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

                const sintomasParrafo = document.createElement('p');
                sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Síntomas: </span> ${sintomas}`;

                // Agregar un botón de eliminar...
                const btnEliminar = document.createElement('button');
                btnEliminar.onclick = () => eliminarCita(id); // añade la opción de eliminar
                btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
                btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'

                // Añade un botón de editar...
                const btnEditar = document.createElement('button');
                const cita = cursor.value;
                btnEditar.onclick = () => editarCita(cita);

                btnEditar.classList.add('btn', 'btn-info');
                btnEditar.innerHTML = 'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'

                // Agregar al HTML
                divCita.appendChild(mascotaParrafo);
                divCita.appendChild(propietarioParrafo);
                divCita.appendChild(telefonoParrafo);
                divCita.appendChild(fechaParrafo);
                divCita.appendChild(horaParrafo);
                divCita.appendChild(sintomasParrafo);
                divCita.appendChild(btnEliminar)
                divCita.appendChild(btnEditar)

                contenedorCitas.appendChild(divCita);

                // Ve al siguiente elemento
                cursor.continue();
            }
        }

    }
    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}
const administrarCitas = new Citas();
// console.log(administrarCitas);
const ui = new UI(administrarCitas);


function nuevaCita(e) {
    e.preventDefault();

    const { mascota, propietario, telefono, fecha, hora, sintomas } = objCita;
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if (edicion) {

        // Pasar el objeto de la cita a edición - Se pasa una copia del objeto. SI NO LO HAGO ME GENERA UN DUPLICADO DE INFORMACIÓN
        administrarCitas.editarCita({ ...objCita });

        // Editando cita de la BD
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        objectStore.put(objCita);

        transaction.oncomplete = function() {
            ui.imprimirAlerta('Cita editada. Recordar estar a tiempo, ¡Gracias!', 'correcto');
    
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
    
            editando = false;
        }

        transaction.onerror = function() {
            console.log('Hubo un error');
        }
    } else {
        // Agregarle un id aleatorio al objeto creado (Para poder modificar o eliminar la cita)
        objCita.id = Date.now();
        // Creando una nueva cita
        administrarCitas.agregarCita({ ...objCita });
        // Mostrar Mensaje

        const transaction = DB.transaction(['citas'], 'readwrite');
        // Habilitar el objecstore
        const objectStore = transaction.objectStore('citas');

        objectStore.add(objCita);
        transaction.oncomplete = function () {
            console.log('Cita Agregada');
            // Mostrar mensaje de que todo esta bien...
            ui.imprimirAlerta('Se agregó correctamente')
        }
    }
    // reiniciar el objeto
    reiniciarObj();
    // Mostrar el HTML de las citas
    ui.imprimirCitas();
    // resetear el formulario
    formulario.reset();

}

function reiniciarObj() {
    objCita.mascota = '';
    objCita.propietario = '';
    objCita.telefono = '';
    objCita.fecha = '';
    objCita.hora = '';
    objCita.sintomas = '';
}

function eliminarCita(id) {
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');

    objectStore.delete(id);

    transaction.oncomplete = function () {
        // console.log('Cita eliminada');
        ui.imprimirCitas();
    }

    transaction.onerror = function () {
        console.log('Problema para eliminar la cita');

    }
    // administrarCitas.eliminarCita(id);
}

function editarCita(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Llenar los input del formulario con los datos a editar
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    // Llenar el objeto
    objCita.mascota = mascota;
    objCita.propietario = propietario;
    objCita.telefono = telefono;
    objCita.fecha = fecha;
    objCita.hora = hora;
    objCita.sintomas = sintomas;
    objCita.id = id; //se requiere el id de la cita - así no esté en el objeto principal (el id se crea a la vez que se crea la cita)

    // Decir que estamos editando nuestra cita
    edicion = true;
    // console.log(cita);
}

function crearDB() {
    // Crear la BD
    const crearDB = window.indexedDB.open('citas', 1);

    // Si existe algún error
    crearDB.onerror = function () {
        console.log('Hay un error al crear la BD');
    }

    // Si fue exitoso la creación de la DB
    crearDB.onsuccess = function () {
        // console.log('Se creó correctamente la BD');
        DB = crearDB.result;

        // Mostrar citas al cargar pero indexedDB ya está listo
        ui.imprimirCitas();
        // console.log(DB);
    }

    // Definir el schema
    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas', {
            keyPath: 'id',
            autoIncrement: true
        });

        // Definir todas las columnas
        objectStore.createIndex('mascota', 'mascota', { unique: false });
        objectStore.createIndex('propietario', 'propietario', { unique: false });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
        objectStore.createIndex('hora', 'hora', { unique: false });
        objectStore.createIndex('sintomas', 'sintomas', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });

        // console.log('Database creada y lista');

    }
}


