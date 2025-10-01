import p5 from "p5";
import "./style.css";
import { Bench } from "tinybench";

function getNeighbors(x, y) {
  const arrNeighbors = new Array();

  const relativePosition = [
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ];

  for (let i = 0; i < relativePosition.length; i++) {
    if (
      x + relativePosition[i].x >= 0 &&
      y + relativePosition[i].y >= 0 &&
      x + relativePosition[i].x < gridCols &&
      y + relativePosition[i].y < gridRows
    ) {
      const neighborsPosition = {
        x: x + relativePosition[i].x,
        y: y + relativePosition[i].y,
      };

      arrNeighbors.push(neighborsPosition);
    }
  }

  return arrNeighbors;
}

function neighborsLivingCount(pX, pY) {
  let neighborsCount = 0;

  const neighbors = currentGen[pY][pX].neighbors;

  for (let i = 0; i < neighbors.length; i++) {
    if (currentGen[neighbors[i].y][neighbors[i].x].alive === 1) {
      neighborsCount++;
    }
  }

  return neighborsCount;
}

function createGrid() {
  const grid = new Array();

  for (let y = 0; y < gridRows; y++) {
    const row = new Array();

    for (let x = 0; x < gridCols; x++) {
      const cell = {
        alive: 0,
        neighbors: getNeighbors(x, y),
      };

      row.push(cell);
    }

    grid.push(row);
  }

  return grid;
}

function randomizeCells(grid) {
  const newGrid = structuredClone(grid);

  newGrid.forEach((a) => {
    a.forEach((b) => {
      b.alive = Math.floor(Math.random() * 2);
    });
  });

  return newGrid;
}

function generateNextGen() {
  let nextGen = structuredClone(grid);

  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const neighborsLiving = neighborsLivingCount(col, row);

      //game of life roules:
      if (
        (currentGen[row][col].alive === 1 && neighborsLiving === 2) ||
        neighborsLiving === 3
      ) {
        nextGen[row][col].alive = 1;
      } else if (currentGen[row][col].alive === 0 && neighborsLiving === 3) {
        nextGen[row][col].alive = 1;
      } else if (currentGen[row][col].alive === 1 && neighborsLiving > 3) {
        nextGen[row][col].alive = 0;
      } else if (currentGen[row][col].alive === 1 && neighborsLiving < 2) {
        nextGen[row][col].alive = 0;
      }
    }
  }

  currentGen = nextGen;
}

const gridCols = 100;
const gridRows = 100;

let grid = createGrid();

let currentGen = createGrid();

currentGen = randomizeCells(currentGen);

const gridSize = {
  width: 800,
  height: 800,
};

const setup = (p) =>
  function () {
    const canvas = p.createCanvas(gridSize.width, gridSize.height);

    p.frameRate(8);
    p.background(200);

    canvas.position(
      document.body.clientWidth / 2 - gridSize.width / 2,
      document.body.clientHeight / 2 - gridSize.height / 2,
    );

    canvas.parent("conteiner");
  };

const draw = (p) =>
  function () {
    generateNextGen();

    const size = gridSize.width / gridCols;

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        currentGen[row][col].alive ? p.fill(0) : p.fill(255);

        p.square(col * size, row * size, size);
        p.stroke(220);
      }
    }
  };

const intance = (p) => {
  p.setup = setup(p);
  p.draw = draw(p);
};

const init = new p5(intance);

init;

async function benchmark() {
  const bench = new Bench({ name: "simple benchmark", time: 100 });

  bench.add("create grid", () => generateNextGen);
  bench.add("deep clone array", () => structuredClone(grid));
  bench.add("draw", () => draw);

  await bench.run();

  console.table(bench.table());
}
