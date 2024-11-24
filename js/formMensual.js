import { database } from './firebase.js';
import {
	ref,
	set,
	onValue,
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js';

// ==================== Manejo del Formulario Mensual ====================

document
	.getElementById('monthlyDataForm')
	.addEventListener('submit', async (event) => {
		event.preventDefault();

		// Capturar valores del formulario
		const sellOutMensual = document.getElementById('sellOutMensual').value || 0;
		const sellInMensual = document.getElementById('sellInMensual').value || 0;
		const piezasOrdenadas =
			document.getElementById('piezasOrdenadas').value || 0;
		const piezasConCita = document.getElementById('piezasConCita').value || 0;
		const piezasSinCita = document.getElementById('piezasSinCita').value || 0;
		const forecastMensual =
			document.getElementById('forecastMensual').value || 0;

		// Validación de campos
		if (
			!sellOutMensual ||
			!sellInMensual ||
			!piezasOrdenadas ||
			!piezasConCita ||
			!piezasSinCita ||
			!forecastMensual
		) {
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
			const storedData =
				JSON.parse(localStorage.getItem('dashboardData')) || {};
			localStorage.setItem(
				'dashboardData',
				JSON.stringify({ ...storedData, ...updatedData }),
			);

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
		console.log('Datos en tiempo real:', data);
		// Actualiza otros elementos dinámicos si es necesario
	} else {
		console.log('No hay datos en Firebase.');
	}
});
