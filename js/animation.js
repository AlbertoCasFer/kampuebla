document.addEventListener('DOMContentLoaded', () => {
	const leftBottle = document.querySelector('.left-bottle');
	const rightBottle = document.querySelector('.right-bottle');

	let leftDirection = 1;
	let rightDirection = -1;
	let positionLeft = 10;
	let positionRight = 10;

	function moveBottles() {
		// Movimiento botella izquierda
		positionLeft += leftDirection;
		if (positionLeft >= 30 || positionLeft <= 10) {
			leftDirection *= -1; // Cambiar dirección
		}
		leftBottle.style.left = `${positionLeft}px`;

		// Movimiento botella derecha
		positionRight += rightDirection;
		if (positionRight >= 30 || positionRight <= 10) {
			rightDirection *= -1; // Cambiar dirección
		}
		rightBottle.style.right = `${positionRight}px`;

		requestAnimationFrame(moveBottles); // Continuar animación
	}

	moveBottles();
});
