import { database } from './firebase.js';
import {
	ref,
	onValue,
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js';

// Referencia a las métricas en Firebase
const metricsRef = ref(database, 'metrics');

// Escuchar datos en tiempo real
onValue(metricsRef, (snapshot) => {
	const data = snapshot.val();
	if (data) {
		document.getElementById('sellIn2023Value').textContent = `${
			data.sellIn2023 || 0
		} pzas`;
		document.getElementById('sellOut2023Value').textContent = `${
			data.sellOut2023 || 0
		} pzas`;
		document
			.querySelectorAll('.sellIn2024Display')
			.forEach((el) => (el.textContent = `${data.sellIn2024 || 0} pzas`));
		document
			.querySelectorAll('.sellOut2024Display')
			.forEach((el) => (el.textContent = `${data.sellOut2024 || 0} pzas`));
		document.getElementById('forecast2024Value').textContent = `${
			data.forecast2024 || 0
		} pzas`;

		// Cálculos adicionales
		if (data.sellIn2023 && data.sellIn2024) {
			const cambioSellIn =
				((data.sellIn2024 - data.sellIn2023) / data.sellIn2023) * 100;
			document.getElementById(
				'porcentajeCambioSellIn',
			).textContent = `${cambioSellIn.toFixed(2)}%`;
		}
		if (data.sellOut2023 && data.sellOut2024) {
			const cambioSellOut =
				((data.sellOut2024 - data.sellOut2023) / data.sellOut2023) * 100;
			document.getElementById(
				'porcentajeCambio',
			).textContent = `${cambioSellOut.toFixed(2)}%`;
		}
	} else {
		console.log('No hay datos en Firebase.');
	}
});

document.addEventListener('DOMContentLoaded', () => {
	// Cargar datos desde Local Storage
	const storedData = JSON.parse(localStorage.getItem('dashboardData')) || {};

	// Variables globales inicializadas desde el almacenamiento local
	const sellOut2023 = storedData.sellOut2023;
	const sellOut2024 = storedData.sellOut2024;
	const sellIn2023 = storedData.sellIn2023; // Nueva variable
	const sellIn2024 = storedData.sellIn2024;
	const forecast2024 = storedData.forecast2024;
	const fillRate = storedData.fillRate;
	const ddiProm = storedData.ddiProm;
	const sellOutMensual = storedData.sellOutMensual;
	const forecastMensual = storedData.forecastMensual;
	const facturadoMes = storedData.facturadoMes;
	const pedidosTransito = storedData.pedidosTransito;
	const sellInMensual = storedData.sellInMensual; // Nueva variable
	const piezasOrdenadas = storedData.piezasOrdenadas; // Nueva variable
	const piezasConCita = storedData.piezasConCita; // Nueva variable
	const piezasSinCita = storedData.piezasSinCita;

	// Cálculos dinámicos
	const porcentajeCambioSellOut =
		sellOut2023 != null && sellOut2024 != null
			? ((sellOut2024 - sellOut2023) / sellOut2023) * 100
			: null;

	const porcentajeCambioSellIn =
		sellIn2023 != null && sellIn2024 != null
			? ((sellIn2024 - sellIn2023) / sellIn2023) * 100
			: null;

	const avance2024vsForecast =
		sellOut2024 != null && forecast2024 != null
			? (sellOut2024 / forecast2024) * 100
			: null;

	const difVsSellOutSellIn =
		sellOut2024 != null && sellIn2024 != null
			? (sellOut2024 / sellIn2024) * 100
			: null;

	// Actualizar Sell In 2023 en el DOM
	const sellIn2023Element = document.getElementById('sellIn2023Value');
	if (sellIn2023Element) {
		if (storedData.sellIn2023 !== undefined) {
			sellIn2023Element.textContent = `${parseInt(
				storedData.sellIn2023,
			).toLocaleString()} pzas`;
		} else {
			sellIn2023Element.textContent = 'Sin datos';
		}
	}

	// Actualizar porcentajeCambioSellOut en el DOM
	const porcentajeCambioElement = document.getElementById('porcentajeCambio');
	if (porcentajeCambioElement) {
		if (porcentajeCambioSellOut !== null) {
			porcentajeCambioElement.textContent = `${porcentajeCambioSellOut.toFixed(
				2,
			)}%`;
		} else {
			porcentajeCambioElement.textContent = 'Datos insuficientes';
		}
	}

	// Actualizar porcentajeCambioSellIn en el DOM
	const porcentajeCambioSellInElement = document.getElementById(
		'porcentajeCambioSellIn',
	);
	if (porcentajeCambioSellInElement) {
		if (porcentajeCambioSellIn !== null) {
			porcentajeCambioSellInElement.textContent = `${porcentajeCambioSellIn.toFixed(
				2,
			)}%`;
		} else {
			porcentajeCambioSellInElement.textContent = 'Datos insuficientes';
		}
	}

	// Actualizar Sell Out 2023
	if (sellOut2023 !== undefined) {
		document.getElementById('sellOut2023Value').textContent = `${parseInt(
			sellOut2023,
		).toLocaleString()} pzas`;
	}

	// Actualizar todas las ocurrencias de Sell Out 2024
	if (sellOut2024 !== undefined) {
		const sellOut2024Elements = document.querySelectorAll(
			'.sellOut2024Display',
		);
		sellOut2024Elements.forEach((element) => {
			element.textContent = `${parseInt(sellOut2024).toLocaleString()} pzas`;
		});
	}

	if (forecastMensual !== undefined) {
		document.getElementById('forecastMensualValue').textContent = `${parseInt(
			forecastMensual,
		).toLocaleString()} pzas`;
	}

	// Actualizar todas las ocurrencias de Sell In 2024
	if (sellIn2024 !== undefined) {
		const sellIn2024Elements = document.querySelectorAll('.sellIn2024Display');
		sellIn2024Elements.forEach((element) => {
			element.textContent = `${parseInt(sellIn2024).toLocaleString()} pzas`;
		});
	}

	// Actualizar Forecast 2024
	if (forecast2024 !== undefined) {
		document.getElementById('forecast2024Value').textContent = `${parseInt(
			forecast2024,
		).toLocaleString()} pzas`;
	}

	// Actualizar porcentaje de avance vs Forecast 2024
	if (avance2024vsForecast !== null) {
		const porcentajeVsForecastElement = document.getElementById(
			'porcentajeVsForecast2024',
		);
		if (porcentajeVsForecastElement) {
			porcentajeVsForecastElement.textContent = `${avance2024vsForecast.toFixed(
				2,
			)}%`;
		}
	}

	// Actualizar porcentaje de Sell Out vs Sell In
	if (difVsSellOutSellIn !== null) {
		const sellOutVsSellInElement = document.getElementById('SellOutVsSellIn');
		if (sellOutVsSellInElement) {
			sellOutVsSellInElement.textContent = `${difVsSellOutSellIn.toFixed(2)}%`;
		}
	}

	// Actualizar Piezas Ordenadas
	if (piezasOrdenadas !== undefined) {
		document.getElementById('piezasOrdenadasValue').textContent = `${parseInt(
			piezasOrdenadas,
		).toLocaleString()} pzas`;
	}

	// Actualizar Piezas con Cita
	if (piezasConCita !== undefined) {
		document.getElementById('piezasConCitaValue').textContent = `${parseInt(
			piezasConCita,
		).toLocaleString()} pzas`;
	}
	if (sellOutMensual !== undefined) {
		document.getElementById('sellOutMensualValue').textContent = `${parseInt(
			sellOutMensual,
		).toLocaleString()} pzas`;
	}

	// Actualizar Piezas sin Cita
	if (piezasSinCita !== undefined) {
		document.getElementById('piezasSinCitaValue').textContent = `${parseInt(
			piezasSinCita,
		).toLocaleString()} pzas`;
	}

	// Actualizar Fill Rate
	if (fillRate !== undefined) {
		document.getElementById('fillRate').textContent = `${parseInt(fillRate)} %`;
	}

	// Actualizar DDI Promedio
	if (ddiProm !== undefined) {
		document.getElementById('ddiProm').textContent = `${parseInt(
			ddiProm,
		)} días`;
	}
	if (sellInMensual !== undefined) {
		document.getElementById('sellInMensualValue').textContent = `${parseInt(
			sellInMensual,
		).toLocaleString()} pzas`;
	}

	if (piezasOrdenadas !== undefined) {
		document.getElementById('piezasOrdenadasValue').textContent = `${parseInt(
			piezasOrdenadas,
		).toLocaleString()} pzas`;
	}

	// Actualizar barra de progreso dinámica
	if (sellOutMensual !== undefined && forecastMensual !== undefined) {
		const progresoSO = (sellOutMensual / forecastMensual) * 100;
		const soProgressBar = document.getElementById('soProgressBar');
		if (soProgressBar) {
			soProgressBar.style.width = `${progresoSO}%`;
		}
	}

	if (
		facturadoMes !== undefined &&
		pedidosTransito !== undefined &&
		forecastMensual !== undefined
	) {
		const proyeccionCierre =
			((facturadoMes + pedidosTransito) / forecastMensual) * 100;
		const projectionProgressBar = document.getElementById(
			'projectionProgressBar',
		);
		if (projectionProgressBar) {
			projectionProgressBar.style.width = `${proyeccionCierre}%`;
		}
	}
});

function loadForm() {
	// Hacer una solicitud para cargar el contenido del formulario
	fetch('formDatos.html')
		.then((response) => {
			if (!response.ok) {
				throw new Error('No se pudo cargar el formulario');
			}
			return response.text(); // Obtener el HTML del formulario como texto
		})
		.then((html) => {
			// Insertar el contenido del formulario en el contenedor
			document.getElementById('dynamicContent').innerHTML = html;

			// Ocultar el dashboard al cargar el formulario
			document.getElementById('dashboardContainer').style.display = 'none';

			// Agregar el evento de envío al formulario cargado
			setupFormSubmit();
		})
		.catch((error) => {
			console.error(error);
		});
}

function setupFormSubmit() {
	const form = document.querySelector('#dataForm');
	if (form) {
		form.addEventListener('submit', (event) => {
			event.preventDefault();

			// Cargar datos existentes del Local Storage
			const storedData =
				JSON.parse(localStorage.getItem('dashboardData')) || {};

			// Capturar valores ingresados en el formulario
			const updatedData = {
				...storedData,
				sellOut2023:
					document.getElementById('sellOut2023').value ||
					storedData.sellOut2023,
				sellOut2024:
					document.getElementById('sellOut2024').value ||
					storedData.sellOut2024,
				sellIn2023:
					document.getElementById('sellIn2023').value || storedData.sellIn2023,
				sellIn2024:
					document.getElementById('sellIn2024').value || storedData.sellIn2024,
				forecast2024:
					document.getElementById('forecast2024').value ||
					storedData.forecast2024,
				fillRate:
					document.getElementById('fillRate').value || storedData.fillRate,
				ddiProm: document.getElementById('ddiProm').value || storedData.ddiProm,
			};

			// Guardar datos actualizados en Local Storage
			localStorage.setItem('dashboardData', JSON.stringify(updatedData));

			// Regresar al dashboard
			showDashboard();
		});
	}
}

function showDashboard() {
	// Mostrar el dashboard nuevamente
	document.getElementById('dashboardContainer').style.display = 'block';

	// Limpiar el contenido dinámico
	document.getElementById('dynamicContent').innerHTML = '';

	// Actualizar los datos del dashboard
	updateDashboard();
}

function updateDashboard() {
	// Cargar datos desde Local Storage y actualizar métricas
	const storedData = JSON.parse(localStorage.getItem('dashboardData')) || {};

	const sellOut2023Element = document.getElementById('sellOut2023Value');
	if (sellOut2023Element) {
		sellOut2023Element.textContent = `${parseInt(
			storedData.sellOut2023 || 0,
		).toLocaleString()} pzas`;
	}

	// Actualizar otros valores (Sell Out 2024, Forecast, etc.) según sea necesario
}

// Mostrar botón "Panel de Control" solo para lacastillo
document.addEventListener('DOMContentLoaded', () => {
	// Obtener el usuario logueado desde sessionStorage
	const loggedUser = sessionStorage.getItem('loggedUser');
	const controlPanelButton = document.getElementById('controlPanelButton');

	// Mostrar el botón solo si el usuario es "lacastillo"
	if (loggedUser === 'lacastillo') {
		controlPanelButton.style.display = 'block';
		controlPanelButton.onclick = () => {
			window.location.href = 'admin.html'; // Redirigir al Panel de Control
		};
	}
});

document.addEventListener('DOMContentLoaded', () => {
	const storedData = JSON.parse(localStorage.getItem('dashboardData')) || {};

	// Botella 1: Facturado Mensual vs Forecast
	const facturadoMes = storedData.facturadoMes || 0;
	const forecastMensual = storedData.forecastMensual || 100;
	const progresoFacturado = Math.min(
		(facturadoMes / forecastMensual) * 100,
		100,
	);

	const bottleFillFacturado = document.getElementById('bottleFillFacturado');
	const progressTextFacturado = document.getElementById(
		'progressTextFacturado',
	);

	if (bottleFillFacturado && progressTextFacturado) {
		bottleFillFacturado.style.height = `${progresoFacturado}%`;
		progressTextFacturado.textContent = `${progresoFacturado.toFixed(1)}%`;
	}

	// Botella 2: Sell Out 2024 vs Sell Out 2023
	const sellOut2024 = storedData.sellOut2024 || 0;
	const sellOut2023 = storedData.sellOut2023 || 1; // Evitar división entre 0
	const progresoSellOut = Math.min((sellOut2024 / sellOut2023) * 100, 100);

	const bottleFillSellOut = document.getElementById('bottleFillSellOut');
	const progressTextSellOut = document.getElementById('progressTextSellOut');

	if (bottleFillSellOut && progressTextSellOut) {
		bottleFillSellOut.style.height = `${progresoSellOut}%`;
		progressTextSellOut.textContent = `${progresoSellOut.toFixed(1)}%`;
	}

	// Botella 3: Sell In 2024 vs Sell In 2023
	const sellIn2024 = storedData.sellIn2024 || 0;
	const sellIn2023 = storedData.sellIn2023 || 1; // Evitar división entre 0
	const progresoSellIn = Math.min((sellIn2024 / sellIn2023) * 100, 100);

	const bottleFillSellIn = document.getElementById('bottleFillSellIn');
	const progressTextSellIn = document.getElementById('progressTextSellIn');

	if (bottleFillSellIn && progressTextSellIn) {
		bottleFillSellIn.style.height = `${progresoSellIn}%`;
		progressTextSellIn.textContent = `${progresoSellIn.toFixed(1)}%`;
	}
});

import { database } from './firebase.js';
import {
	ref,
	get,
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js';

function showMetricDetails(metricKey) {
	const modal = document.getElementById('metricDetailsModal');
	const title = document.getElementById('metricTitle');
	const description = document.getElementById('metricDescription');

	// Obtener datos de Firebase
	const metricRef = ref(database, `metrics/${metricKey}`);
	get(metricRef).then((snapshot) => {
		if (snapshot.exists()) {
			const data = snapshot.val();
			title.textContent = `${metricKey} - Detalles`;
			description.textContent = `Valor actual: ${data}`;
			renderMetricChart(metricKey, data); // Renderizar gráfica
			modal.style.display = 'flex'; // Mostrar modal
		} else {
			alert('Datos no disponibles.');
		}
	});
}

function closeMetricDetails() {
	const modal = document.getElementById('metricDetailsModal');
	modal.style.display = 'none';
}

function renderMetricChart(metricKey, data) {
	const ctx = document.getElementById('metricChart').getContext('2d');
	new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['Actual'],
			datasets: [
				{
					label: metricKey,
					data: [data],
					backgroundColor: ['rgba(54, 162, 235, 0.6)'],
				},
			],
		},
		options: {
			responsive: true,
		},
	});
}

// Asignar eventos de clic a las métricas
document.querySelectorAll('.metric').forEach((metric) => {
	metric.addEventListener('click', () => {
		const metricKey = metric.getAttribute('data-metric-key'); // Asume que cada métrica tiene un atributo único
		showMetricDetails(metricKey);
	});
});

import { database } from './firebase.js';
import {
	ref,
	get,
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js';

// Prueba de conexión
const testRef = ref(database, '/metrics');
get(testRef)
	.then((snapshot) => {
		if (snapshot.exists()) {
			console.log('Datos desde Firebase:', snapshot.val());
		} else {
			console.log('No hay datos en Firebase.');
		}
	})
	.catch((error) => {
		console.error('Error conectando a Firebase:', error);
	});
