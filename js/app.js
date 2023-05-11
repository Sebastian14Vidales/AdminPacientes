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
let edicion;

class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
        console.log(this.citas);
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita);
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


    imprimirCitas({ citas }) { //Estoy haciendo destructuring dentro del arreglo de objetos
        // Limpiar HTML
        this.limpiarHTML();

        citas.forEach(cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: </span> ${telefono}`;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Sintomas: </span> ${sintomas}`;

            // Boton para eliminar cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;

            // Eliminar cita al darle click
            btnEliminar.onclick = () => eliminarId(id);

            // Editar cita
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>`;

            // Editar cita al darle click - Toca pasarle todo el objeto de CITA
            btnEditar.onclick = () => editarCita(cita);

            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            // agregar la cita al html
            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }

}

const administrarCitas = new Citas();
// console.log(administrarCitas);
const ui = new UI();

// Eventos del proyecto
eventListener();
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

function nuevaCita(e) {
    e.preventDefault();

    const { mascota, propietario, telefono, fecha, hora, sintomas } = objCita;
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if (edicion) {
        ui.imprimirAlerta('Cita editada. Recordar estar a tiempo, ¡Gracias!', 'correcto');

        // Pasar el objeto de la cita a edición - Se pasa una copia del objeto. SI NO LO HAGO ME GENERA UN DUPLICADO DE INFORMACIÓN
        administrarCitas.editarCita({...objCita});

        // Regresar el texto del botón a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        // Quitando el modo edición
        editando = false;
    } else {
        // Agregarle un id aleatorio al objeto creado (Para poder modificar o eliminar la cita)
        objCita.id = Date.now();
        // Creando una nueva cita
        administrarCitas.agregarCita({ ...objCita });
        // Mostrar Mensaje
        ui.imprimirAlerta('Cita agendada. Estar antes de tiempo con tu mascota', 'correcto');

    }
    // reiniciar el objeto
    reiniciarObj();
    // Mostrar el HTML de las citas
    ui.imprimirCitas(administrarCitas);
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

function eliminarId(id) {
    // Eliminar Cita
    administrarCitas.eliminarCita(id);
    // Muestra un mensaje de que se eliminó la cita
    ui.imprimirAlerta('Se eliminó correctamente la cita', 'correcto');
    // Refrescar Citas
    ui.imprimirCitas(administrarCitas);
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