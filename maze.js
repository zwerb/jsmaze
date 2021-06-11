const MazeWidth = 50;
const MazeHeight = 25;

const Wall = "#";
const Free = " ";
const SomeDude = "*";

const StartX = 1;
const StartY = 0;
const EndX = parseInt(MazeWidth-2);
const EndY = parseInt(MazeHeight-1);

const StartingPoint = [StartX, StartY];
const EndingPoint = [EndX, EndY];

// 1 out of every "X" spaces should be a wall
const RandoFactor = 10;

let Maze = [];

for (let i = 0; i < MazeHeight; i++) {
  let row;
  if (i == 0 || i == MazeHeight - 1) {
    row = new Array(MazeWidth).join(Wall);
    Maze.push(row);
  } else {
    let rowpart = [];
    for (let j = 0; j < MazeWidth; j++) {
      if (j == 0 || j == MazeWidth - 1) {
        rowpart.push(Wall);
      } else {
        let randInt = Math.floor(Math.random() * RandoFactor) + 1;
        if (randInt > 1) {
          rowpart.push(Free);
        } else {
          rowpart.push(Wall);
        }
      }
    }
    Maze.push(rowpart.join(""));
  }
}


Maze = Maze.map((line) => line.split(""));
Maze[StartY][StartX] = Free;
Maze[EndY][EndX] = Free;

function PrintDaMaze() {
  //Maze.forEach(line => console.log(line.join('')))
  let txt = Maze.reduce((p, c) => (p += c.join("") + "\n"), "");
  let html = txt.replace(/[*]/g, (c) => "<font color=red>*</font>");
  $("#mazeOutput").html(html);
}

async function Solve(X, Y) {
  // Make the move (if it's wrong, we will backtrack later.
  Maze[Y][X] = SomeDude;

  // If you want progressive update, uncomment these lines...
  PrintDaMaze();
  await sleep(10);

  // Check if we have reached our goal.
  if (X == EndingPoint[0] && Y == EndingPoint[1]) {
    return true;
  }

  // Recursively search for our goal.

  if (X < MazeWidth && Maze[Y][X + 1] == Free && (await Solve(X + 1, Y))) {
    return true;
  }
  if (Y < MazeHeight && Maze[Y + 1][X] == Free && (await Solve(X, Y + 1))) {
    return true;
  }
  if (X > 0 && Maze[Y][X - 1] == Free && (await Solve(X - 1, Y))) {
    return true;
  }
  if (Y > 0 && Maze[Y - 1][X] == Free && (await Solve(X, Y - 1))) {
    return true;
  }


  // Otherwise we need to backtrack and find another solution.
  Maze[Y][X] = Free;

  // If you want progressive update, uncomment these lines...
  PrintDaMaze();
  await sleep(10);
  return false;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async function () {
  if (await Solve(StartingPoint[StartY], StartingPoint[StartX])) {
    console.log("Solved!");
    PrintDaMaze();
  } else {
    console.log("Cannot solve. :-(");
  }
})();
