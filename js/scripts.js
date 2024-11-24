import { database } from './firebase.js';
import {
  ref,
  set,
  onValue,
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js';

// ==================== Manejo del Formulario Mensual ====================

document.getElementById('monthlyDataForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Capturar valores del formulario
  const sellOutMensual = document.getElementById('sellOutMensual').value || 0;
  const sellInMensual = document.getElementById('sellInMensual').value || 0;
  const piezasOrdenadas = document.getElementById('piezasOrdenadas').value || 0;
  const piezasConCita = document.getElementById('piezasConCita').value || 0;
  const piezasSinCita = document.getElementById('piezasSinCita').value || 0;
  const forecastMensual = document.getElementById('forecastMensual').value || 0;

  // Validación de campos
  if (!sellOutMensual || !sellInMensual || !piezasOrdenadas || !piezasConCita || !piezasSinCita || !forecastMensual) {
    alert('Por favor completa todos los campos.');
    return;
  }

  // Crear objeto de datos
  const updatedData = {
    sellOutMensual: Number(sellOutMensual),
    sellInMensual: Number(sellInMensual),
    piezasOrdenadas: Number(piezasOrdenadas),
    piezasConCita: Number(piezasConCita),
    piezasSinCita: Number(piezasSinCita),
    forecastMensual: Number(forecastMensual),
  };

  try {
    // Guardar datos en Firebase
    await set(ref(database, 'metricsMensuales'), updatedData);

    // Guardar datos en Local Storage
    const storedData = JSON.parse(localStorage.getItem('dashboardData')) || {};
    localStorage.setItem('dashboardData', JSON.stringify({ ...storedData, ...updatedData }));

    alert('Datos mensuales actualizados exitosamente.');
    window.location.href = 'dashboard.html'; // Redirige al dashboard
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    alert('Hubo un error al guardar los datos. Intenta nuevamente.');
  }
});

// ==================== Escuchar Datos en Tiempo Real (Firebase) ====================

const metricsRef = ref(database, 'metricsMensuales');

// Escuchar actualizaciones en tiempo real
onValue(metricsRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    // Actualizar elementos dinámicos del dashboard
    updateDashboard(data);
    console.log('Datos en tiempo real:', data);
  } else {
    console.log('No hay datos en Firebase.');
  }
});

// ==================== Actualizar el Dashboard ====================

function updateDashboard(data) {
  // Actualiza los valores en el DOM usando los datos en tiempo real
  if (data.sellOutMensual !== undefined) {
    document.getElementById('sellOutMensualValue')?.textContent = `${data.sellOutMensual.toLocaleString()} pzas`;
  }
  if (data.sellInMensual !== undefined) {
    document.getElementById('sellInMensualValue')?.textContent = `${data.sellInMensual.toLocaleString()} pzas`;
  }
  if (data.forecastMensual !== undefined) {
    document.getElementById('forecastMensualValue')?.textContent = `${data.forecastMensual.toLocaleString()} pzas`;
  }

  // Calcula y actualiza el progreso dinámico
  if (data.sellOutMensual !== undefined && data.forecastMensual !== undefined) {
    const progress = Math.min((data.sellOutMensual / data.forecastMensual) * 100, 100);
    const progressBar = document.getElementById('soProgressBar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
      progressBar.textContent = `${progress.toFixed(2)}%`;
    }
  }
}

// ==================== Cargar Datos desde Local Storage ====================

document.addEventListener('DOMContentLoaded', () => {
  const storedData = JSON.parse(localStorage.getItem('dashboardData')) || {};

  // Actualiza elementos del DOM con datos locales
  if (storedData.sellOutMensual) {
    document.getElementById('sellOutMensualValue')?.textContent = `${storedData.sellOutMensual.toLocaleString()} pzas`;
  }
  if (storedData.sellInMensual) {
    document.getElementById('sellInMensualValue')?.textContent = `${storedData.sellInMensual.toLocaleString()} pzas`;
  }
  if (storedData.forecastMensual) {
    document.getElementById('forecastMensualValue')?.textContent = `${storedData.forecastMensual.toLocaleString()} pzas`;
  }

  // Actualiza las barras de progreso si corresponde
  updateProgressBars(storedData);
});

// ==================== Barra de Progreso Dinámica ====================

function updateProgressBars(data) {
  if (data.sellOutMensual && data.forecastMensual) {
    const progress = Math.min((data.sellOutMensual / data.forecastMensual) * 100, 100);
    const progressBar = document.getElementById('soProgressBar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
      progressBar.textContent = `${progress.toFixed(2)}%`;
    }
  }
}
