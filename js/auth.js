// Leer usuarios desde localStorage
const users = JSON.parse(localStorage.getItem('users')) || {};

// Función para crear usuarios predeterminados
function createDefaultUsers() {
	if (!users['admin']) {
		users['admin'] = 'admin123'; // Usuario administrador predeterminado
	}
	if (!users['lacastillo']) {
		users['lacastillo'] = 'admin1'; // Usuario con acceso al Panel de Control
	}
	localStorage.setItem('users', JSON.stringify(users));
}

// Función para validar el login
function validateLogin(username, password) {
	return users[username] && users[username] === password; // Retorna true si las credenciales son válidas
}

// Lógica para manejar el formulario de login
document.addEventListener('DOMContentLoaded', () => {
	const authForm = document.getElementById('authForm');
	if (authForm) {
		authForm.addEventListener('submit', (event) => {
			event.preventDefault();

			const username = document.getElementById('username').value.trim();
			const password = document.getElementById('password').value.trim();

			// Validar las credenciales
			if (validateLogin(username, password)) {
				sessionStorage.setItem('loggedUser', username); // Guardar el usuario logueado

				// Redirigir según el usuario
				if (username === 'lacastillo' && password === 'admin1') {
					window.location.href = 'admin.html'; // Redirigir al panel de control
				} else {
					window.location.href = 'dashboard.html'; // Redirigir al dashboard
				}
			} else {
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

	// Crear usuarios predeterminados
	createDefaultUsers();
});

import { database } from './firebase.js';
import {
	ref,
	get,
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js';

document.getElementById('authForm').addEventListener('submit', (event) => {
	event.preventDefault();

	const username = document.getElementById('username').value.trim();
	const password = document.getElementById('password').value.trim();

	const usersRef = ref(database, `users/${username}`);
	get(usersRef)
		.then((snapshot) => {
			if (snapshot.exists() && snapshot.val().password === password) {
				sessionStorage.setItem('loggedUser', username);
				window.location.href =
					username === 'lacastillo' ? 'admin.html' : 'dashboard.html';
			} else {
				alert('Usuario o contraseña incorrectos');
			}
		})
		.catch((error) => {
			console.error('Error al autenticar:', error);
		});
});
