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
