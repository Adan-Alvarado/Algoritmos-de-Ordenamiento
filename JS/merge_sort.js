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
  mergeSortAnimado([...lista], 0, lista.length - 1);
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

// === Algoritmo Merge Sort Animado ===
function mergeSortAnimado(array, left, right) {
  animacionParada = false;
  pasoActual = 0;
  cambiarEstadoBotones(false);

  function sort(left, right) {
    if (animacionParada) {
      comentarioAnimacion.textContent = 'Animación detenida.';
      actualizarVisualizacion();
      cambiarEstadoBotones(true);
      return;
    }

    if (left >= right) {
      // Caso base: un solo elemento
      timeoutId = setTimeout(() => {
        comentarioAnimacion.textContent = `Subarreglo [${left}] ya está ordenado.`;
        // Continúa con otros niveles
      }, 600);
      return;
    }

    const mid = Math.floor((left + right) / 2);

    comentarioAnimacion.textContent = `Dividiendo desde ${left} hasta ${right} en [${left},${mid}] y [${mid+1},${right}].`;
    timeoutId = setTimeout(() => {
      // Ordenar la mitad izquierda
      sort(left, mid);
      timeoutId = setTimeout(() => {
        // Ordenar la mitad derecha
        sort(mid + 1, right);
        timeoutId = setTimeout(() => {
          // Fusionar ambas mitades
          if (!animacionParada) {
            merge(left, mid, right);
          }
        }, 600);
      }, 600);
    }, 800);
  }

  function merge(left, mid, right) {
    comentarioAnimacion.textContent = `Fusionando [${left},${mid}] y [${mid+1},${right}].`;
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    const indicesCambiando = [];

    function fusionar() {
      if (animacionParada) {
        comentarioAnimacion.textContent = 'Animación detenida.';
        actualizarVisualizacion();
        cambiarEstadoBotones(true);
        return;
      }

      if (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
          array[k] = leftArr[i];
          indicesCambiando.push(k);
          comentarioAnimacion.textContent = `Colocando ${leftArr[i]} (izquierda) en posición ${k}.`;
          i++;
        } else {
          array[k] = rightArr[j];
          indicesCambiando.push(k);
          comentarioAnimacion.textContent = `Colocando ${rightArr[j]} (derecha) en posición ${k}.`;
          j++;
        }
        k++;
        timeoutId = setTimeout(fusionar, 600);
      } else if (i < leftArr.length) {
        array[k] = leftArr[i];
        indicesCambiando.push(k);
        comentarioAnimacion.textContent = `Colocando ${leftArr[i]} (resto izquierdo) en posición ${k}.`;
        i++; k++;
        timeoutId = setTimeout(fusionar, 600);
      } else if (j < rightArr.length) {
        array[k] = rightArr[j];
        indicesCambiando.push(k);
        comentarioAnimacion.textContent = `Colocando ${rightArr[j]} (resto derecho) en posición ${k}.`;
        j++; k++;
        timeoutId = setTimeout(fusionar, 600);
      } else {
        // Ya fusionamos
        actualizarVisualizacion(indicesCambiando);
        timeoutId = setTimeout(() => {
          if (left === 0 && right === lista.length - 1) {
            comentarioAnimacion.textContent = '✅ ¡Lista ordenada correctamente!';
            lista = [...array];
            actualizarVisualizacion();
            mostrarAlerta('Ordenamiento completado.');
            cambiarEstadoBotones(true);
          }
        }, 600);
      }
    }

    actualizarVisualizacion([...Array.from({ length: right - left + 1 }, (_, i) => left + i)]);
    timeoutId = setTimeout(fusionar, 800);
  }

  sort(left, right);
}