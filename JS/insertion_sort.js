// === Variables del DOM ===
const inputNumero = document.getElementById('input-numero');
const btnAnadir = document.getElementById('btn-anadir');
const inputTamanoLista = document.getElementById('input-tamano-lista');
const btnGenerar = document.getElementById('btn-generar');
const btnOrdenar = document.getElementById('btn-ordenar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnParar = document.getElementById('btn-parar');
const btnSaltar = document.getElementById('btn-saltar');
const btnTema = document.getElementById('btn-tema');

const listaActualDiv = document.getElementById('lista-actual');
const contenedorArray = document.getElementById('contenedor-array');
const comentarioAnimacion = document.getElementById('comentario-animacion');
const progresoAnimacion = document.getElementById('progreso-animacion');
const cajaAlertas = document.getElementById('caja-alertas');

// Array que guarda los números ingresados o generados
let lista = [];
// Guarda el ID del timeout para poder detener la animación si se necesita
let timeoutId = null;
// Bandera que indica si la animación ha sido detenida
let animacionParada = false;
// Cuenta el número de pasos o iteraciones que se han realizado
let pasoActual = 0;

// === Inicialización ===
document.addEventListener('DOMContentLoaded', () => {
  const temaGuardado = sessionStorage.getItem('tema') || 'claro';
  if (temaGuardado === 'oscuro') {
    document.body.classList.add('dark');
  }
  actualizarBotonTema();
  actualizarVisualizacion();
});

// === Funciones principales ===
function mostrarAlerta(mensaje) {
  cajaAlertas.textContent = mensaje;
  setTimeout(() => {
    cajaAlertas.textContent = '';
  }, 3000);
}

function actualizarVisualizacion(indicesResaltados = []) {
  listaActualDiv.textContent = lista.length > 0 ? `[ ${lista.join(', ')} ]` : '[ ]';
  pasoActual++;
  progresoAnimacion.textContent = `Paso: ${pasoActual}`;

  contenedorArray.innerHTML = '';
  lista.forEach((valor, i) => {
    const bloque = document.createElement('div');
    bloque.textContent = valor;
    bloque.style.height = `${valor * 4}px`;
    bloque.classList.add('bloque');
    if (indicesResaltados.includes(i)) {
      bloque.classList.add('resaltado');
    }
    contenedorArray.appendChild(bloque);
  });
}

function cambiarEstadoBotones(habilitar) {
  const botones = [btnOrdenar, btnReiniciar, btnAnadir, btnGenerar];
  botones.forEach(btn => {
    btn.disabled = !habilitar;
  });
  btnParar.disabled = habilitar;
  btnSaltar.disabled = habilitar;

  btnOrdenar.innerHTML = habilitar ? 'Ordenar' : 'Ordenando... <span style="margin-left: 6px;">🔄</span>';
}

// === Event Listeners ===
btnAnadir.addEventListener('click', () => {
  const valorStr = inputNumero.value.trim();
  if (!valorStr) {
    mostrarAlerta('Por favor ingrese un número.');
    return;
  }

  const valor = Number(valorStr);
  if (isNaN(valor) || valor < 1 || valor > 100) {
    mostrarAlerta('Solo números entre 1 y 100.');
    return;
  }

  if (lista.length >= 25) {
    mostrarAlerta('Máximo 25 números.');
    return;
  }

  lista.push(valor);
  inputNumero.value = '';
  pasoActual = 0;
  progresoAnimacion.textContent = 'Paso: 0';
  actualizarVisualizacion();
  mostrarAlerta(`Número ${valor} añadido.`);
});

btnGenerar.addEventListener('click', () => {
  const tamanoStr = inputTamanoLista.value.trim();
  if (!tamanoStr) {
    mostrarAlerta('Ingrese una cantidad válida.');
    return;
  }

  const tamano = Number(tamanoStr);
  if (tamano < 1 || tamano > 25) {
    mostrarAlerta('Tamaño debe estar entre 1 y 25.');
    return;
  }

  lista = Array.from({ length: tamano }, () => Math.floor(Math.random() * 100) + 1);
  pasoActual = 0;
  progresoAnimacion.textContent = 'Paso: 0';
  actualizarVisualizacion();
  comentarioAnimacion.textContent = 'Lista generada.';
  mostrarAlerta(`Lista de ${tamano} generada.`);
});

btnReiniciar.addEventListener('click', () => {
  lista = [];
  inputNumero.value = '';
  inputTamanoLista.value = '';
  comentarioAnimacion.textContent = '';
  pasoActual = 0;
  progresoAnimacion.textContent = 'Paso: 0';
  actualizarVisualizacion();
  mostrarAlerta('Lista reiniciada.');
  if (timeoutId) clearTimeout(timeoutId);
  animacionParada = false;
  cambiarEstadoBotones(true);
});

btnOrdenar.addEventListener('click', () => {
  if (lista.length < 2) {
    mostrarAlerta('Necesitas al menos 2 números para ordenar.');
    return;
  }
  insertionSortAnimado([...lista]);
});

btnParar.addEventListener('click', () => {
  animacionParada = true;
  if (timeoutId) clearTimeout(timeoutId);
});

btnSaltar.addEventListener('click', () => {
  if (timeoutId) clearTimeout(timeoutId);
  animacionParada = true;
  lista.sort((a, b) => a - b);
  pasoActual++;
  progresoAnimacion.textContent = `Paso: ${pasoActual}`;
  actualizarVisualizacion();
  comentarioAnimacion.textContent = 'Animación saltada. Lista ordenada.';
  mostrarAlerta('Lista ordenada sin animación.');
  cambiarEstadoBotones(true);
});

btnTema.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const tema = document.body.classList.contains('dark') ? 'oscuro' : 'claro';
  sessionStorage.setItem('tema', tema);
  actualizarBotonTema();
});

function actualizarBotonTema() {
  if (document.body.classList.contains('dark')) {
    btnTema.textContent = '☀️ Cambiar a Claro';
  } else {
    btnTema.textContent = '🌙 Cambiar a Oscuro';
  }
}

// === Algoritmo Insertion Sort Animado ===
function insertionSortAnimado(array) {
  let i = 1; // Empezamos desde el segundo elemento
  animacionParada = false;
  pasoActual = 0;
  cambiarEstadoBotones(false);

  function siguientePaso() {
    if (animacionParada) {
      comentarioAnimacion.textContent = 'Animación detenida.';
      actualizarVisualizacion();
      cambiarEstadoBotones(true);
      return;
    }

    if (i < array.length) {
      const key = array[i];
      let j = i - 1;

      comentarioAnimacion.textContent = `Insertando ${key} en su posición correcta.`;
      actualizarVisualizacion([i]); // Resalta el elemento actual (clave)

      // Mueve los elementos mayores que la clave una posición adelante
      while (j >= 0 && array[j] > key) {
        comentarioAnimacion.textContent = `Comparando ${array[j]} > ${key}, moviendo...`;
        array[j + 1] = array[j];
        j--;
        // Usa un timeout anidado para animar cada paso del desplazamiento
        return setTimeout(() => {
          actualizarVisualizacion([j + 1]);
          setTimeout(siguientePaso, 600);
        }, 600);
      }

      array[j + 1] = key;
      i++;
      timeoutId = setTimeout(siguientePaso, 600);
    } else {
      comentarioAnimacion.textContent = '✅ ¡Lista ordenada correctamente!';
      lista = [...array];
      actualizarVisualizacion();
      mostrarAlerta('Ordenamiento completado.');
      cambiarEstadoBotones(true);
    }
  }

  siguientePaso();
}