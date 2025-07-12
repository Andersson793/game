import p5 from "p5";

const gridWidth = 20;
const gridHeigth = 20;
const p = 950;
const o = document.body.clientWidth;

class Cell {
  constructor(a, x, y) {
    ((this.aLive = a),
      (this.position = {
        x: x,
        y: y,
      }));
  }

  get getNeighbors() {
    const arrNeighbor = new Array();

    const B = [
      { x: -1, y: -1 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ];

    B.forEach((neighbors) => {
      if (
        this.position.x + neighbors.x >= 0 &&
        this.position.y + neighbors.y >= 0 &&
        this.position.x + neighbors.x < gridWidth &&
        this.position.y + neighbors.y < gridHeigth
      ) {
        const neighborsPosition = {
          x: this.position.x + neighbors.x,
          y: this.position.y + neighbors.y,
        };

        arrNeighbor.push(neighborsPosition);
      }
    });

    return arrNeighbor;
  }
}

let currentGrid;

function createGrid() {
  const grid = new Array();

  for (let y = 0; y < gridHeigth; y++) {
    const row = new Array();

    for (let x = 0; x < gridWidth; x++) {
      const cell = new Cell(0, x, y);

      row.push(cell);
    }

    grid.push(row);
  }

  return grid;
}

const grid = createGrid();

function randomizeCells(grid) {
  const g = grid;

  g.forEach((a, y) => {
    a.forEach((b, x) => {
      b.aLive = Math.floor(Math.random() * 2);
    });
  });

  return g;
}

currentGrid = grid;
currentGrid = randomizeCells(currentGrid);
let nextGrid = grid;

function newGrid() {
  function neighborsLivingCount(pX, pY) {
    let neighborsCount = 0;

    const neighbors = new Cell(0, pX, pY).getNeighbors;

    for (let i = 0; i < neighbors.length; i++) {
      if (currentGrid[neighbors[i].y][neighbors[i].x].aLive === 1) {
        neighborsCount++;
      }
    }

    return neighborsCount;
  }

  for (let row = 0; row < gridHeigth; row++) {
    for (let col = 0; col < gridWidth; col++) {
      //get the neighbors for each cell
      let neighborsLiving = neighborsLivingCount(col, row);

      //game of life roules:
      if (
        (currentGrid[row][col].aLive === 1 && neighborsLiving === 2) ||
        neighborsLiving === 3
      ) {
        nextGrid[row][col].aLive = 1;
      }

      if (currentGrid[row][col].aLive === 0 && neighborsLiving === 3) {
        nextGrid[row][col].aLive = 1;
      }

      if (currentGrid[row][col].aLive === 1 && neighborsLiving > 3) {
        nextGrid[row][col].aLive = 0;
      }

      if (currentGrid[row][col].aLive === 1 && neighborsLiving < 2) {
        nextGrid[row][col].aLive = 0;
      }
    }
  }

  currentGrid = nextGrid;
  nextGrid = grid;
}

const gridSize = {
  width: 500,
  height: 500,
};

const cellSize = {
  width: gridSize.width / gridWidth,
  height: gridSize.height / gridHeigth,
};

const setup = (p) =>
  function () {
    const mycanvas = p.createCanvas(gridSize.width, gridSize.height);

    p.frameRate(12);
    p.background(200);

    mycanvas.parent("conteiner");
  };

const draw = (p) =>
  function () {
    newGrid();

    for (let row = 0; row < gridHeigth; row++) {
      for (let col = 0; col < gridWidth; col++) {
        currentGrid[row][col].aLife ? p.fill(0) : p.fill(255);

        const w = col * cellSize.width;
        const h = row * cellSize.height;

        p.rect(w, h, gridSize.width, gridSize.height);
      }
    }
  };

const intance = (p) => {
  p.setup = setup(p);
  p.draw = draw(p);
};

new p5(intance);
