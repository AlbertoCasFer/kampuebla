import { database } from './firebase.js';
import {
	ref,
	get,
	set,
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js';

// ==================== Manejo de Usuarios ====================

// Leer usuarios desde Local Storage o inicializarlos
const localUsers = JSON.parse(localStorage.getItem('users')) || {};

// Crear usuarios predeterminados en Local Storage
function createDefaultUsersLocal() {
	if (!localUsers['admin']) {
		localUsers['admin'] = 'admin123'; // Usuario administrador predeterminado
	}
	if (!localUsers['lacastillo']) {
		localUsers['lacastillo'] = 'admin1'; // Usuario con acceso al Panel de Control
	}
	localStorage.setItem('users', JSON.stringify(localUsers));
}

// Crear usuarios predeterminados en Firebase
async function createDefaultUsersFirebase() {
	const usersRef = ref(database, 'users');
	const snapshot = await get(usersRef);

	if (!snapshot.exists()) {
		const defaultUsers = {
			admin: { password: 'admin123' },
			lacastillo: { password: 'admin1' },
		};
		await set(usersRef, defaultUsers);
		console.log('Usuarios predeterminados creados en Firebase');
	}
}

// Validar credenciales desde Local Storage
function validateLoginLocal(username, password) {
	return localUsers[username] && localUsers[username] === password;
}

// Validar credenciales desde Firebase
async function validateLoginFirebase(username, password) {
	try {
		const userRef = ref(database, `users/${username}`);
		const snapshot = await get(userRef);

		if (snapshot.exists() && snapshot.val().password === password) {
			return true; // Usuario válido
		}
		return false; // Usuario inválido
	} catch (error) {
		console.error('Error al validar el usuario desde Firebase:', error);
		return false;
	}
}

// ==================== Lógica del Formulario de Login ====================

document.addEventListener('DOMContentLoaded', async () => {
	// Crear usuarios predeterminados en ambos sistemas
	createDefaultUsersLocal();
	await createDefaultUsersFirebase();

	const authForm = document.getElementById('authForm');
	if (authForm) {
		authForm.addEventListener('submit', async (event) => {
			event.preventDefault();

			const username = document.getElementById('username').value.trim();
			const password = document.getElementById('password').value.trim();

			// Validar credenciales primero en Firebase, luego en Local Storage
			const isValidFirebase = await validateLoginFirebase(username, password);
			const isValidLocal = validateLoginLocal(username, password);

			if (isValidFirebase || isValidLocal) {
				// Guardar el usuario logueado en sessionStorage
				sessionStorage.setItem('loggedUser', username);

				// Redirigir según el usuario
				if (username === 'lacastillo') {
					window.location.href = 'admin.html'; // Redirigir al panel de control
				} else {
					window.location.href = 'dashboard.html'; // Redirigir al dashboard
				}
			} else {
				// Mostrar mensaje de error
				let errorElement = document.getElementById('authError');
				if (!errorElement) {
					// Crear el elemento de error si no existe
					errorElement = document.createElement('p');
					errorElement.id = 'authError';
					errorElement.style.color = 'red';
					errorElement.style.marginTop = '10px';
					document.querySelector('.login-container').appendChild(errorElement);
				}
				errorElement.style.display = 'block';
				errorElement.textContent = 'Usuario o contraseña incorrectos';
			}
		});
	}
});
