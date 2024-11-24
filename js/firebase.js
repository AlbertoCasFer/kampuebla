// Configuración de Firebase
const firebaseConfig = {
	apiKey: 'AIzaSyAi-BH_-SyJmGKkaMQgzFx3X1KZwrsBPrg',
	authDomain: 'dashboardelec.firebaseapp.com',
	databaseURL: 'https://dashboardelec-default-rtdb.firebaseio.com/',
	projectId: 'dashboardelec',
	storageBucket: 'dashboardelec.firebasestorage.app',
	messagingSenderId: '730211335600',
	appId: '1:730211335600:web:9ea806fa4a06e017c92a75',
	measurementId: 'G-ZTQ06DZ46L',
};

// Importar módulos de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

console.log('Firebase inicializado');

export { database };
