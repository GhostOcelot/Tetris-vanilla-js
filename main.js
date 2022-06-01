import { blocksArray } from './blocks.js';

const gameArea = document.querySelector('.game-area');
const message = document.querySelector('.msg');
const score = document.querySelector('.score');

const gameInfo = {
	IS_GAME_OVER: true,
	GRID: [],
	GRID_WIDTH: 12,
	GRID_HEIGHT: 20,
	CURRENT_BLOCK_POSITION: [],
	CURRENT_BLOCK_OFFSET: { x: 5, y: 1 },
	CURRENT_BLOCK_COLOR: '',
	DROP_INTERVAL_TIME: 1000,
	DROP_INTERVAL_FUNCTION: null,
	SCORE: 0,
};

function createLookupTable(height, width) {
	const gameGrid = [];
	for (let column = 0; column < height; column++) {
		const row = [];
		for (let cell = 0; cell < width; cell++) {
			row.push(0);
		}
		gameGrid.push(row);
	}
	gameInfo.GRID = gameGrid;
	drawGrid();
	document.addEventListener('keydown', e => {
		if (e.key === 'Enter' && gameInfo.IS_GAME_OVER) {
			startGame();
		}
	});
}

function drawGrid() {
	Array.from(gameArea.children).forEach(item => item.remove());

	gameInfo.GRID.forEach(column => {
		column.forEach(item => {
			const cell = document.createElement('div');
			cell.classList.add('cell');
			if (item === 0) {
			} else if (item === 1) {
				cell.classList.add(`block-${gameInfo.CURRENT_BLOCK_COLOR}`);
			} else if (item === 2) {
				cell.classList.add('block-still');
			}
			gameArea.append(cell);
		});
	});
}

function createBlock() {
	if (gameInfo.GRID[0].includes(2)) {
		gameOver();
		return;
	}
	gameInfo.CURRENT_BLOCK_POSITION = [];
	const newKidOnTheBlock = blocksArray[Math.floor(Math.random() * blocksArray.length)];
	gameInfo.CURRENT_BLOCK_COLOR = newKidOnTheBlock.color;
	newKidOnTheBlock.position.forEach((row, rowIndex) => {
		row.forEach((value, valueIndex) => {
			if (value === 1) {
				gameInfo.CURRENT_BLOCK_POSITION.push({ x: valueIndex + 4, y: rowIndex });
			}
		});
	});

	gameInfo.CURRENT_BLOCK_POSITION.forEach(item => {
		gameInfo.GRID[item.y][item.x] = 1;
	});
	drawGrid();
	document.addEventListener('keydown', addControls);
}

function dropBlock() {
	if (
		!gameInfo.CURRENT_BLOCK_POSITION.some(item => item.y === gameInfo.GRID_HEIGHT - 1) &&
		!gameInfo.CURRENT_BLOCK_POSITION.some(
			item => gameInfo.GRID[item.y + 1].includes(2) && gameInfo.GRID[item.y + 1][item.x] === 2
		)
	) {
		gameInfo.CURRENT_BLOCK_POSITION.forEach(item => {
			gameInfo.GRID[item.y][item.x] = 0;
		});

		gameInfo.CURRENT_BLOCK_POSITION.forEach(item => {
			item.y++;
			gameInfo.GRID[item.y][item.x] = 1;
		});
		gameInfo.CURRENT_BLOCK_OFFSET.y++;
		drawGrid();
	} else {
		gameInfo.CURRENT_BLOCK_POSITION.forEach(item => {
			gameInfo.GRID[item.y][item.x] = 2;
		});
		gameInfo.CURRENT_BLOCK_OFFSET = { x: 5, y: 1 };
		completeLine();
		createBlock();
	}
}

function moveBlockToSide(direction) {
	gameInfo.CURRENT_BLOCK_POSITION.forEach(item => {
		gameInfo.GRID[item.y][item.x] = 0;
		if (direction === 'left') {
			item.x--;
		} else if (direction === 'right') {
			item.x++;
		}
	});
	gameInfo.CURRENT_BLOCK_POSITION.forEach(item => {
		gameInfo.GRID[item.y][item.x] = 1;
	});
	drawGrid();
}

function rotateBlock() {
	if (gameInfo.CURRENT_BLOCK_COLOR === 'yellow') {
		return;
	}
	const newblocksPositionArray = [];
	let newBlockPosition = {};
	gameInfo.CURRENT_BLOCK_POSITION.forEach(item => {
		gameInfo.GRID[item.y][item.x] = 0;
		if (gameInfo.CURRENT_BLOCK_COLOR === 'brown') {
			newBlockPosition = {
				x: -item.y + gameInfo.CURRENT_BLOCK_OFFSET.x + gameInfo.CURRENT_BLOCK_OFFSET.y,
				y: item.x - gameInfo.CURRENT_BLOCK_OFFSET.x + gameInfo.CURRENT_BLOCK_OFFSET.y - 1,
			};
		} else {
			newBlockPosition = {
				x: -item.y + gameInfo.CURRENT_BLOCK_OFFSET.x + gameInfo.CURRENT_BLOCK_OFFSET.y,
				y: item.x - gameInfo.CURRENT_BLOCK_OFFSET.x + gameInfo.CURRENT_BLOCK_OFFSET.y,
			};
		}
		newblocksPositionArray.push(newBlockPosition);
	});

	if (
		!newblocksPositionArray.some(
			item =>
				item.x < 0 ||
				item.y < 0 ||
				item.x > gameInfo.GRID_WIDTH - 1 ||
				item.y > gameInfo.GRID_HEIGHT - 1 ||
				gameInfo.GRID[item.y][item.x] === 2
		)
	) {
		gameInfo.CURRENT_BLOCK_POSITION = newblocksPositionArray;
	}
	gameInfo.CURRENT_BLOCK_POSITION.forEach(item => {
		gameInfo.GRID[item.y][item.x] = 1;
	});
	drawGrid();
}

function completeLine() {
	gameInfo.GRID.forEach((row, rowIndex) => {
		if (row.every(value => value === 2)) {
			gameInfo.GRID.splice(rowIndex, 1);
			gameInfo.GRID.unshift(new Array(12).fill(0));
			gameInfo.SCORE++;
			score.textContent = `Score: ${gameInfo.SCORE}`;
			speedUp();
		}
	});
}

function gameOver() {
	gameInfo.IS_GAME_OVER = true;
	(gameInfo.DROP_INTERVAL_TIME = 1000), (message.textContent = 'Game over!');
	document.removeEventListener('keydown', addControls);
	clearInterval(gameInfo.DROP_INTERVAL_FUNCTION);
}

function addControls(e) {
	if (e.key === 'ArrowDown') {
		dropBlock();
	} else if (
		e.key === 'ArrowLeft' &&
		gameInfo.CURRENT_BLOCK_POSITION.every(item => item.x > 0) &&
		gameInfo.CURRENT_BLOCK_POSITION.every(item => gameInfo.GRID[item.y][item.x - 1] !== 2)
	) {
		gameInfo.CURRENT_BLOCK_OFFSET.x--;
		moveBlockToSide('left');
	} else if (
		e.key === 'ArrowRight' &&
		gameInfo.CURRENT_BLOCK_POSITION.every(item => item.x < gameInfo.GRID_WIDTH - 1) &&
		gameInfo.CURRENT_BLOCK_POSITION.every(item => gameInfo.GRID[item.y][item.x + 1] !== 2)
	) {
		gameInfo.CURRENT_BLOCK_OFFSET.x++;
		moveBlockToSide('right');
	} else if (e.key === 'ArrowUp') {
		rotateBlock();
	}
	drawGrid();
}

function speedUp() {
	gameInfo.DROP_INTERVAL_TIME -= 20;
	clearInterval(gameInfo.DROP_INTERVAL_FUNCTION);
	gameInfo.DROP_INTERVAL_FUNCTION = setInterval(dropBlock, gameInfo.DROP_INTERVAL_TIME);
	console.log(gameInfo.DROP_INTERVAL_TIME);
}

function startGame() {
	gameInfo.SCORE = 0;
	gameInfo.IS_GAME_OVER = false;
	createLookupTable(gameInfo.GRID_HEIGHT, gameInfo.GRID_WIDTH);
	message.textContent = 'Good luck!';
	message.classList.remove('animated');
	score.textContent = `Score: ${gameInfo.SCORE}`;
	createBlock();
	gameInfo.DROP_INTERVAL_FUNCTION = setInterval(dropBlock, gameInfo.DROP_INTERVAL_TIME);
}

createLookupTable(gameInfo.GRID_HEIGHT, gameInfo.GRID_WIDTH);
