document.addEventListener('DOMContentLoaded', () => {
	const deleteUserButton = document.getElementById('deleteUserButton');
	const userList = document.getElementById('userList');

	// Mostrar lista de usuarios
	function displayUsers() {
		const users = JSON.parse(localStorage.getItem('users')) || {};
		userList.innerHTML = '';
		Object.keys(users).forEach((username) => {
			if (username !== 'admin') {
				const li = document.createElement('li');
				li.textContent = username;
				userList.appendChild(li);
			}
		});
	}

	displayUsers();

	// Manejar eliminación de usuarios
	deleteUserButton.addEventListener('click', () => {
		const action = prompt(
			'Escriba "todos" para eliminar todos los usuarios o ingrese el nombre del usuario a eliminar:',
		);
		if (action === 'todos') {
			const users = JSON.parse(localStorage.getItem('users')) || {};
			Object.keys(users).forEach((username) => {
				if (username !== 'admin') {
					delete users[username];
				}
			});
			localStorage.setItem('users', JSON.stringify(users));
			alert('Todos los usuarios (excepto el admin) han sido eliminados.');
		} else if (action) {
			const users = JSON.parse(localStorage.getItem('users')) || {};
			if (users[action]) {
				delete users[action];
				localStorage.setItem('users', JSON.stringify(users));
				alert(`El usuario "${action}" ha sido eliminado.`);
			} else {
				alert('El usuario no existe.');
			}
		}
		displayUsers();
	});
});

import { database } from './firebase.js';
import {
	ref,
	onValue,
	remove,
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js';

// Cargar usuarios
const userList = document.getElementById('userList');
onValue(ref(database, 'users'), (snapshot) => {
	userList.innerHTML = ''; // Limpia la lista
	snapshot.forEach((childSnapshot) => {
		const user = childSnapshot.key;
		const li = document.createElement('li');
		li.textContent = user;
		userList.appendChild(li);
	});
});

// Eliminar usuario
document.getElementById('deleteUserButton').addEventListener('click', () => {
	const username = prompt('Ingrese el nombre del usuario a eliminar:');
	if (username) {
		remove(ref(database, `users/${username}`))
			.then(() => alert('Usuario eliminado'))
			.catch((error) => console.error('Error al eliminar usuario:', error));
	}
});
