import { database } from './firebase.js';
import {
	ref,
	get,
	set,
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js';

// ==================== Manejo de Usuarios ====================

// Leer usuarios desde Local Storage
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

// ==================== Validación de Usuarios ====================

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

// ==================== Validar Usuario Logueado ====================

function redirectIfUnauthorized() {
	const loggedUser = sessionStorage.getItem('loggedUser');
	if (!loggedUser || loggedUser !== 'lacastillo') {
		alert('Acceso no autorizado. Redirigiendo al inicio de sesión.');
		window.location.href = 'index.html'; // Redirigir al login
	}
}

// ==================== Manejo del Panel de Control ====================

document.addEventListener('DOMContentLoaded', async () => {
	// Crear usuarios predeterminados en ambos sistemas
	createDefaultUsersLocal();
	await createDefaultUsersFirebase();

	// Validar que el usuario logueado tiene acceso
	redirectIfUnauthorized();

	// Mostrar usuarios en la interfaz del panel de control
	const usersRef = ref(database, 'users');
	const snapshot = await get(usersRef);

	if (snapshot.exists()) {
		const users = snapshot.val();
		const usersList = document.getElementById('usersList');
		if (usersList) {
			usersList.innerHTML = ''; // Limpiar lista antes de mostrar usuarios
			Object.keys(users).forEach((username) => {
				const userItem = document.createElement('li');
				userItem.textContent = `${username}: ${users[username].password}`;
				usersList.appendChild(userItem);
			});
		}
	} else {
		console.log('No hay usuarios en Firebase.');
	}

	// Manejar creación de nuevos usuarios desde el panel
	const addUserForm = document.getElementById('addUserForm');
	if (addUserForm) {
		addUserForm.addEventListener('submit', async (event) => {
			event.preventDefault();
			const newUsername = document.getElementById('newUsername').value.trim();
			const newPassword = document.getElementById('newPassword').value.trim();

			if (!newUsername || !newPassword) {
				alert('Por favor completa todos los campos.');
				return;
			}

			try {
				// Agregar nuevo usuario a Firebase
				await set(ref(database, `users/${newUsername}`), {
					password: newPassword,
				});
				alert('Usuario agregado exitosamente.');
				window.location.reload(); // Recargar la página para mostrar el nuevo usuario
			} catch (error) {
				console.error('Error al agregar el usuario:', error);
				alert('Hubo un error al agregar el usuario.');
			}
		});
	}
});
