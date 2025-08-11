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

// Array que guarda los números
let lista = [];
let timeoutId = null;
let animacionParada = false;
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
  quickSortAnimado([...lista], 0, lista.length - 1);
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

// === Algoritmo Quick Sort Animado ===
function quickSortAnimado(array, low, high) {
  animacionParada = false;
  pasoActual = 0;
  cambiarEstadoBotones(false);

  function sort(low, high) {
    if (animacionParada) {
      comentarioAnimacion.textContent = 'Animación detenida.';
      actualizarVisualizacion();
      cambiarEstadoBotones(true);
      return;
    }

    if (low < high) {
      comentarioAnimacion.textContent = `Ordenando subarreglo desde índice ${low} hasta ${high}.`;
      // Mostramos el pivote y los índices
      timeoutId = setTimeout(() => {
        particionar(low, high);
      }, 800);
    } else {
      // Caso base: subarreglo de tamaño 0 o 1
      timeoutId = setTimeout(() => {
        if (low >= high) {
          comentarioAnimacion.textContent = `Subarreglo [${low}, ${high}] ya está ordenado.`;
          timeoutId = setTimeout(() => {
            // Verificamos si ya terminó todo
            if (low === 0 && high === lista.length - 1) {
              comentarioAnimacion.textContent = '✅ ¡Lista ordenada correctamente!';
              lista = [...array];
              actualizarVisualizacion();
              mostrarAlerta('Ordenamiento completado.');
              cambiarEstadoBotones(true);
            }
          }, 600);
        }
      }, 600);
    }
  }

  function particionar(low, high) {
    const pivot = array[high]; // Elegimos el último como pivote
    let i = low - 1; // Índice del elemento más pequeño

    comentarioAnimacion.textContent = `Pivote elegido: ${pivot} (índice ${high}).`;

    function iterarJ(j) {
      if (animacionParada) {
        comentarioAnimacion.textContent = 'Animación detenida.';
        actualizarVisualizacion();
        cambiarEstadoBotones(true);
        return;
      }

      if (j < high) {
        if (array[j] <= pivot) {
          i++;
          if (i !== j) {
            comentarioAnimacion.textContent = `Intercambiando ${array[i]} y ${array[j]} (ambos ≤ pivote).`;
            [array[i], array[j]] = [array[j], array[i]];
          }
        }
        // Resalta el pivote y el elemento actual
        actualizarVisualizacion([j, high]);
        timeoutId = setTimeout(() => iterarJ(j + 1), 600);
      } else {
        // Colocar el pivote en su posición final
        i++;
        if (i !== high) {
          comentarioAnimacion.textContent = `Colocando pivote ${pivot} en posición ${i}.`;
          [array[i], array[high]] = [array[high], array[i]];
        }
        actualizarVisualizacion([i]);
        timeoutId = setTimeout(() => {
          // Ordenar recursivamente las partes
          sort(low, i - 1);
          sort(i + 1, high);
        }, 800);
      }
    }

    iterarJ(low);
  }

  sort(low, high);
}