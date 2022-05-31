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
	CURRENT_BLOCK_COLOR: '',
	DROP_INTERVAL_TIME: 500,
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
		if (e.key === ' ' && gameInfo.IS_GAME_OVER) {
			startGame();
		}
	});
}

function drawGrid() {
	Array.from(gameArea.children).forEach(item => item.remove());

	gameInfo.GRID.forEach(column => {
		column.forEach(item => {
			if (item === 0) {
				const cell = document.createElement('div');
				cell.classList.add('cell');
				gameArea.append(cell);
			} else if (item === 1) {
				const block = document.createElement('div');
				block.classList.add('cell');
				switch (gameInfo.CURRENT_BLOCK_COLOR) {
					case 'red':
						block.classList.add('block-red');
						break;
					case 'blue':
						block.classList.add('block-blue');
						break;
					case 'green':
						block.classList.add('block-green');
						break;
					case 'orange':
						block.classList.add('block-orange');
						break;
					case 'purple':
						block.classList.add('block-purple');
						break;
					case 'yellow':
						block.classList.add('block-yellow');
						break;
					case 'brown':
						block.classList.add('block-brown');
						break;
					default:
						break;
				}
				gameArea.append(block);
			} else if (item === 2) {
				const blockStill = document.createElement('div');
				blockStill.classList.add('cell');
				blockStill.classList.add('block-still');
				gameArea.append(blockStill);
			}
		});
	});
}

function createBlock() {
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
	if (gameInfo.GRID[0].includes(2)) {
		gameOver();
	} else if (
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
		drawGrid();
	} else {
		gameInfo.CURRENT_BLOCK_POSITION.forEach(item => {
			gameInfo.GRID[item.y][item.x] = 2;
		});
		completeLine();
		createBlock();
	}
}

function moveBlockToSide(direction) {
	if (!gameInfo.CURRENT_BLOCK_POSITION.some(item => item.y === gameInfo.GRID_HEIGHT - 1)) {
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
}

function rotateBlock() {}

function completeLine() {
	gameInfo.GRID.forEach((row, rowIndex) => {
		if (row.every(value => value === 2)) {
			gameInfo.GRID.splice(rowIndex, 1);
			gameInfo.GRID.unshift(new Array(12).fill(0));
			console.table(gameInfo.GRID);
			gameInfo.SCORE++;
			score.textContent = `Score: ${gameInfo.SCORE}`;
		}
	});
}

function gameOver() {
	gameInfo.IS_GAME_OVER = true;
	message.textContent = 'Game over!';
	document.removeEventListener('keydown', addControls);
	clearInterval(gameInfo.DROP_INTERVAL_FUNCTION);
}

function addControls(e) {
	if (e.key === 'ArrowDown') {
		dropBlock();
		drawGrid();
	} else if (
		e.key === 'ArrowLeft' &&
		gameInfo.CURRENT_BLOCK_POSITION.every(item => item.x > 0) &&
		gameInfo.CURRENT_BLOCK_POSITION.every(item => gameInfo.GRID[item.y][item.x - 1] !== 2)
	) {
		moveBlockToSide('left');
		drawGrid();
	} else if (
		e.key === 'ArrowRight' &&
		gameInfo.CURRENT_BLOCK_POSITION.every(item => item.x < gameInfo.GRID_WIDTH - 1) &&
		gameInfo.CURRENT_BLOCK_POSITION.every(item => gameInfo.GRID[item.y][item.x + 1] !== 2)
	) {
		moveBlockToSide('right');
		drawGrid();
	}
}

function startGame() {
	gameInfo.SCORE = 0;
	gameInfo.IS_GAME_OVER = false;
	createLookupTable(gameInfo.GRID_HEIGHT, gameInfo.GRID_WIDTH);
	message.textContent = 'Good luck!';
	score.textContent = `Score: ${gameInfo.SCORE}`;
	createBlock();
	gameInfo.DROP_INTERVAL_FUNCTION = setInterval(dropBlock, gameInfo.DROP_INTERVAL_TIME);
}

createLookupTable(gameInfo.GRID_HEIGHT, gameInfo.GRID_WIDTH);
