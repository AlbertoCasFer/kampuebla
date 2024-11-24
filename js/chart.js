let currentZoomedChart = null; // Variable para almacenar la instancia actual del gráfico ampliado

// Configuración de gráficas
const charts = [
	{
		id: 'salesChart2024',
		data: {
			labels: [
				'Ene',
				'Feb',
				'Mar',
				'Abr',
				'May',
				'Jun',
				'Jul',
				'Ago',
				'Sep',
				'Oct',
				'Nov',
				'Dic',
			],
			datasets: [
				{
					label: 'SO Mensual 2024',
					data: [
						977977, 1191553, 1431852, 1538569, 2157032, 730329, 1359282, 670937,
						730357, 629863, 587604, 0,
					],
					backgroundColor: 'rgba(54, 162, 235, 0.2)',
					borderColor: 'rgba(54, 162, 235, 1)',
					borderWidth: 1,
				},
			],
		},
		config: {
			type: 'bar',
			options: {
				responsive: true,
				scales: {
					x: { beginAtZero: true },
					y: {},
				},
			},
		},
		title: 'Ventas Mensuales 2024',
	},
	{
		id: 'salesComparisonChart',
		data: {
			labels: [
				'Ene',
				'Feb',
				'Mar',
				'Abr',
				'May',
				'Jun',
				'Jul',
				'Ago',
				'Sep',
				'Oct',
				'Nov',
				'Dic',
			],
			datasets: [
				{
					label: 'SI 2024',
					data: [
						800040, 1262670, 1487220, 3116454, 210849, 1915494, 1143345, 532563,
						473928, 663921, 215341, 0,
					],
					borderColor: '#4682b4',
					backgroundColor: 'rgba(70, 130, 180, 0.2)',
					borderWidth: 2,
					tension: 0.4,
				},
				{
					label: 'SI 2023',
					data: [
						575784, 659990, 1062576, 692112, 1526280, 1971900, 1461564, 1295168,
						1452104, 1252560, 1339602, 610356,
					],
					borderColor: '#f39c12',
					backgroundColor: 'rgba(243, 156, 18, 0.2)',
					borderWidth: 2,
					tension: 0.4,
				},
			],
		},
		config: {
			type: 'line',
			options: {
				responsive: true,
				plugins: {
					legend: { position: 'top' },
					tooltip: { mode: 'index', intersect: false },
				},
				scales: {
					x: { beginAtZero: true },
					y: {},
				},
			},
		},
		title: 'Comparativa de Ventas 2023 vs 2024',
	},
	{
		id: 'sellInForecastChart',
		data: {
			labels: [
				'Ene',
				'Feb',
				'Mar',
				'Abr',
				'May',
				'Jun',
				'Jul',
				'Ago',
				'Sep',
				'Oct',
				'Nov',
				'Dic',
			],
			datasets: [
				{
					label: 'Sell In 2024',
					data: [
						800040, 1262670, 1487220, 3116454, 210849, 1915494, 1143345, 532563,
						473928, 663921, 215341, 0,
					],
					borderColor: '#1f77b4',
					backgroundColor: 'rgba(31, 119, 180, 0.2)',
					borderWidth: 2,
					tension: 0.4,
				},
				{
					label: 'Forecast 2024',
					data: [
						775057, 1302603, 1392301, 1487621, 1644145, 1759873, 1559372,
						1427024, 1068388, 1065109, 896385, 901889,
					],
					borderColor: '#ff7f0e',
					backgroundColor: 'rgba(255, 127, 14, 0.2)',
					borderWidth: 2,
					tension: 0.4,
				},
			],
		},
		config: {
			type: 'line',
			options: {
				responsive: true,
				plugins: {
					legend: { position: 'top' },
					tooltip: { mode: 'index', intersect: false },
				},
				scales: {
					x: { beginAtZero: true },
					y: {},
				},
			},
		},
		title: 'Sell Out vs Forecast 2024',
	},
];

// Renderizar las gráficas iniciales
charts.forEach((chart) => {
	const ctx = document.getElementById(chart.id).getContext('2d');
	new Chart(ctx, { ...chart.config, data: chart.data });
});

// Configuración del zoom
const zoomOverlay = document.getElementById('zoomOverlay');
const zoomedChart = document.getElementById('zoomedChart');
const zoomTitle = document.getElementById('zoomTitle');

document.querySelectorAll('.chart-container').forEach((container, index) => {
	container.addEventListener('click', () => {
		const chartConfig = charts[index];

		// Actualizar el título del zoom
		zoomTitle.textContent = chartConfig.title;

		// Mostrar el contenedor de zoom
		zoomOverlay.classList.add('active');

		// Destruir cualquier gráfica previamente ampliada
		if (currentZoomedChart) {
			currentZoomedChart.destroy();
		}

		// Renderizar la nueva gráfica ampliada
		const ctxZoomed = zoomedChart.getContext('2d');
		currentZoomedChart = new Chart(ctxZoomed, {
			...chartConfig.config,
			data: chartConfig.data,
		});
	});
});

// Cerrar el zoom al hacer clic fuera de la gráfica
zoomOverlay.addEventListener('click', (event) => {
	if (event.target === zoomOverlay) {
		zoomOverlay.classList.remove('active');
		if (currentZoomedChart) {
			currentZoomedChart.destroy();
			currentZoomedChart = null;
		}
	}
});

document.addEventListener('DOMContentLoaded', () => {
	// Cálculo del progreso
	const progresoSO = (sellOutMensual / forecastMensual) * 100;

	// Actualizar barra de progreso
	const progressBar = document.getElementById('soProgressBar');
	const progressValue = document.getElementById('soProgressValue');

	progressBar.style.width = `${progresoSO}%`;
	progressValue.textContent = `Avance: ${progresoSO.toFixed(2)}%`;

	// Opcional: Validar límite de progreso
	if (progresoSO >= 100) {
		progressBar.style.backgroundColor = '#4caf50'; // Verde para indicar cumplimiento
	} else {
		progressBar.style.backgroundColor = '#ff9800'; // Naranja para progreso incompleto
	}
});

document.addEventListener('DOMContentLoaded', () => {
	// Cálculo del progreso
	const proyeccionCierre =
		((facturadoMes + pedidosTransito) / forecastMensual) * 100;

	// Actualizar barra de progreso
	const projectionProgressBar = document.getElementById(
		'projectionProgressBar',
	);
	const projectionProgressValue = document.getElementById(
		'projectionProgressValue',
	);

	projectionProgressBar.style.width = `${proyeccionCierre}%`;
	projectionProgressValue.textContent = `Avance: ${proyeccionCierre.toFixed(
		2,
	)}%`;

	// Validar límites de progreso
	if (proyeccionCierre >= 100) {
		projectionProgressBar.style.backgroundColor = '#4caf50'; // Verde para indicar cumplimiento
	} else if (proyeccionCierre >= 50) {
		projectionProgressBar.style.backgroundColor = '#ff9800'; // Naranja para progreso medio
	} else {
		projectionProgressBar.style.backgroundColor = '#f44336'; // Rojo para progreso bajo
	}
});

document.addEventListener('DOMContentLoaded', () => {
	const tableZoomOverlay = document.getElementById('tableZoomOverlay');
	const zoomTableTitle = document.getElementById('zoomTableTitle');
	const zoomedTableContainer = document.getElementById('zoomedTableContainer');

	const estados = [
		{ estado: 'Puebla', sellOut: 5000, sellIn: 6000 },
		{ estado: 'Veracruz', sellOut: 7000, sellIn: 8000 },
		{ estado: 'Oaxaca', sellOut: 6000, sellIn: 6500 },
	];

	const formatos = [
		{ formato: 'Club', sellOut: 1104370 },
		{ formato: 'Reparto', sellOut: 282894 },
		{ formato: 'GBS', sellOut: 227713 },
		{ formato: 'Mostrador', sellOut: 148276 },
		{ formato: 'Frescura', sellOut: 22218 },
		{ formato: 'Express', sellOut: 3234 },
	];

	const skus = [
		{ sku: 'ELECTROLIT COCO 12/625 ML', ventas: 74113 },
		{ sku: 'ELECTROLIT MANZANA 12/625 ML', ventas: 48674 },
		{ sku: 'ELECTROLIT NJA/MAND 12/625 ML', ventas: 42582 },
		{ sku: 'ELECTROLIT FRESA 12/625 ML', ventas: 71278 },
		{ sku: 'ELECTROLIT PIÑA 625 ML (AI)', ventas: 52543 },
	];

	// Renderizar tablas existentes y nuevas
	const renderTable = (data, tableId, orderByKey = null, limit = null) => {
		const tableBody = document.querySelector(`#${tableId} tbody`);
		if (!tableBody) return;

		if (orderByKey) {
			data.sort((a, b) => b[orderByKey] - a[orderByKey]);
		}

		const limitedData = limit ? data.slice(0, limit) : data;
		limitedData.forEach((row) => {
			const tr = document.createElement('tr');
			Object.entries(row).forEach(([key, value]) => {
				const td = document.createElement('td');
				td.textContent =
					typeof value === 'number' ? value.toLocaleString('en-US') : value;
				td.className = typeof value === 'number' ? 'numeric' : '';
				tr.appendChild(td);
			});
			tableBody.appendChild(tr);
		});
	};

	// Tablas originales
	renderTable(estados, 'stateTable', 'sellOut');
	renderTable(formatos, 'formatTable', 'sellOut');
	renderTable(skus, 'skuTable', 'ventas', 10);

	// Nuevas tablas
	renderTable(estados, 'stateTable2', 'sellOut');
	renderTable(formatos, 'formatTable2', 'sellOut');
	renderTable(skus, 'skuTable2', 'ventas', 10);

	// Zoom para todas las tablas
	document.querySelectorAll('.table-wrapper').forEach((tableWrapper) => {
		tableWrapper.addEventListener('click', () => {
			const table = tableWrapper.querySelector('table');
			const title = tableWrapper.querySelector('h3').textContent;

			const clonedTable = table.cloneNode(true);
			zoomedTableContainer.innerHTML = '';
			zoomedTableContainer.appendChild(clonedTable);

			zoomTableTitle.textContent = title;
			tableZoomOverlay.classList.add('active');
		});
	});

	tableZoomOverlay.addEventListener('click', (event) => {
		if (event.target === tableZoomOverlay) {
			tableZoomOverlay.classList.remove('active');
		}
	});
});

document.addEventListener('DOMContentLoaded', () => {
	// Datos para la gráfica de pastel
	const estados = [
		{ estado: 'Puebla', sellOut: 5000 },
		{ estado: 'Veracruz', sellOut: 7000 },
		{ estado: 'Oaxaca', sellOut: 6000 },
	];

	// Extraer datos
	const labels = estados.map((row) => row.estado);
	const sellOutData = estados.map((row) => row.sellOut);

	// Crear gráfica de pastel original
	const ctx = document.getElementById('statePieChart').getContext('2d');
	const originalPieChart = new Chart(ctx, {
		type: 'pie',
		data: {
			labels: labels,
			datasets: [
				{
					data: sellOutData,
					backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colores personalizados
					hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				legend: { position: 'top' },
				datalabels: {
					formatter: (value, context) => {
						const total = context.dataset.data.reduce(
							(acc, val) => acc + val,
							0,
						);
						const percentage = ((value / total) * 100).toFixed(2); // Calcula el %
						return `${percentage}%`; // Retorna el porcentaje
					},
					color: '#fff', // Color del texto
					font: {
						size: 14, // Tamaño de la fuente
					},
				},
			},
		},
		plugins: [ChartDataLabels], // Activa el plugin
	});

	// Configuración para el zoom
	const zoomOverlay = document.getElementById('chartZoomOverlay');
	const zoomedCanvas = document.getElementById('zoomedPieChart');
	let zoomedChartInstance = null;

	// Evento para activar el zoom
	document
		.querySelector('.pie-chart-container')
		.addEventListener('click', () => {
			if (zoomedChartInstance) {
				zoomedChartInstance.destroy();
			}

			// Crear una nueva gráfica ampliada en el canvas del zoom
			const zoomedCtx = zoomedCanvas.getContext('2d');
			zoomedChartInstance = new Chart(zoomedCtx, {
				type: 'pie',
				data: originalPieChart.data, // Usa los mismos datos que la gráfica original
				options: {
					responsive: true,
					plugins: {
						legend: { position: 'top' },
						datalabels: {
							formatter: (value, context) => {
								const total = context.dataset.data.reduce(
									(acc, val) => acc + val,
									0,
								);
								const percentage = ((value / total) * 100).toFixed(2); // Calcula el %
								return `${percentage}%`; // Retorna el porcentaje
							},
							color: '#fff',
							font: { size: 16 },
						},
					},
				},
				plugins: [ChartDataLabels], // Activa el plugin en el zoom
			});

			// Mostrar el contenedor del zoom
			zoomOverlay.classList.add('active');
		});

	// Cerrar el zoom al hacer clic fuera del contenido
	zoomOverlay.addEventListener('click', (event) => {
		if (event.target === zoomOverlay) {
			zoomOverlay.classList.remove('active');
			if (zoomedChartInstance) {
				zoomedChartInstance.destroy();
				zoomedChartInstance = null;
			}
		}
	});
});

document.addEventListener('DOMContentLoaded', () => {
	// Datos para la nueva gráfica de barras
	const formatosData = [
		{ formato: 'Club', sellOut: 1104370 },
		{ formato: 'Reparto', sellOut: 282894 },
		{ formato: 'GBS', sellOut: 227713 },
		{ formato: 'Mostrador', sellOut: 148276 },
		{ formato: 'Frescura', sellOut: 22218 },
		{ formato: 'Express', sellOut: 3234 },
	];

	// Extraer etiquetas y valores
	const formatLabels = formatosData.map((item) => item.formato);
	const formatSellOut = formatosData.map((item) => item.sellOut);

	// Crear la gráfica de barras
	const formatChartCtx = document
		.getElementById('formatBarChart')
		.getContext('2d');
	let formatChart = new Chart(formatChartCtx, {
		type: 'bar',
		data: {
			labels: formatLabels,
			datasets: [
				{
					label: 'Sell Out por Formato',
					data: formatSellOut,
					backgroundColor: [
						'#FF6384',
						'#36A2EB',
						'#FFCE56',
						'#4CAF50',
						'#FF5722',
						'#9C27B0',
					],
					borderColor: [
						'#FF6384',
						'#36A2EB',
						'#FFCE56',
						'#4CAF50',
						'#FF5722',
						'#9C27B0',
					],
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				legend: { position: 'top' },
				tooltip: { mode: 'index', intersect: false },
			},
			scales: {
				x: { beginAtZero: true },
				y: {
					beginAtZero: true,
					ticks: { callback: (value) => value.toLocaleString() },
				},
			},
		},
	});

	// Configuración del zoom
	const zoomOverlay = document.getElementById('zoomOverlay');
	const zoomedCanvas = document.getElementById('zoomedChart');
	const zoomTitle = document.getElementById('zoomTitle');
	let zoomedChartInstance = null;

	// Agregar evento para activar el zoom
	document
		.getElementById('formatBarChartContainer')
		.addEventListener('click', () => {
			// Mostrar el contenedor del zoom
			zoomOverlay.classList.add('active');

			// Destruir cualquier gráfica previamente ampliada
			if (zoomedChartInstance) {
				zoomedChartInstance.destroy();
			}

			// Crear una nueva gráfica ampliada en el canvas del zoom
			const zoomedCtx = zoomedCanvas.getContext('2d');
			zoomedChartInstance = new Chart(zoomedCtx, {
				type: 'bar',
				data: formatChart.data, // Usa los mismos datos que la gráfica original
				options: {
					...formatChart.options, // Copia las opciones de la gráfica original
					plugins: {
						legend: { position: 'top' },
						tooltip: { mode: 'index', intersect: false },
					},
				},
			});

			// Actualizar el título del zoom
			zoomTitle.textContent = 'Sell Out por Formato (Zoom)';
		});

	// Cerrar el zoom al hacer clic fuera del contenido
	zoomOverlay.addEventListener('click', (event) => {
		if (event.target === zoomOverlay) {
			zoomOverlay.classList.remove('active');
			if (zoomedChartInstance) {
				zoomedChartInstance.destroy();
				zoomedChartInstance = null;
			}
		}
	});
});

function generateChartFromTable() {
	const labels = [];
	const data = [];

	// Recorrer las filas de la tabla
	table.rows().every(function () {
		const row = this.data();
		labels.push(row[0]); // Primera columna como etiqueta
		data.push(parseFloat(row[1])); // Segunda columna como valor
	});

	// Crear gráfica con Chart.js
	const ctx = document.getElementById('tableChart').getContext('2d');
	new Chart(ctx, {
		type: 'bar', // Cambia a 'line' o 'pie' si lo prefieres
		data: {
			labels: labels,
			datasets: [
				{
					label: 'Datos de la Tabla',
					data: data,
					backgroundColor: 'rgba(75, 192, 192, 0.2)',
					borderColor: 'rgba(75, 192, 192, 1)',
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			scales: {
				y: {
					beginAtZero: true,
				},
			},
		},
	});
}
