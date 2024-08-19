/*
  Mars Rover
  
  You are to build the backing logic behind an API to navigate a bidirectional rover along a two dimensional cartesian plain (x,y) representation of the planet Mars. Each point will include a topographical label designating the terrain at that location.
  
  Map Example:

  (0,0)
   	['P', 'P', 'P', 'C', 'P'],
	  ['P', 'M', 'P', 'C', 'P'],
	  ['P', 'M', 'P', 'C', 'P'],
	  ['P', 'M', 'P', 'P', 'P'],
	  ['P', 'M', 'P', 'P', 'P']
                          (4,4)

  Details:
  
  - The rover when initialized will be provided an initial starting point (x, y) as well as a starting direction (N, S, E, W) that the rover is facing
  - The rover should receive its commands as a string array. e.g. ['F', 'B', 'L', R']
  - The rover may move forward and backward with the (F, B) character commands
  - The rover may turn left and right with the (L, R) character commands
  - The rover should execute all given commands in sequence
    - If: The rover is given a valid command
      - Then: Update the rovers direction or location
    - If: All commands have been executed 
      - Then: return an OK status along with the location and direction
    - If: The rover is provided a command that would result in the rover entering terrain that is an obstacle
      - Then: return an OBSTACLE status code along with the last successful location and direction of the rover
    - If: The rover is provided an invalid command
      - Then: return an INVALID_COMMAND status code along with the last successful location and direction of the rover
    - If: The rover is given a command that would result in leaving the edge of the world
      - Then: return an OBSTACLE status code along with the last successful location and direction of the rover
  
  Further Instructions:
  
  - Implement your code to make the below tests pass
  - Feel free to modify any code you wish to suit your preference. Also, don't feel limited to methods provided feel free add more (encouraged)
  - If you modify exercise code (i.e use functional instead of class based Rover) you'll need to modify the tests accordingly
  - Read the tests! They have helpful in better understanding the requirements 
  - add a moveTo() method that takes the (x,y) coordinates to move the rover along the most optimal path bypassing obstacles
  - https://en.wikipedia.org/wiki/A*_search_algorithm
  - https://en.wikipedia.org/wiki/Dijkstra's_algorithm
*/
const TERRAIN_TYPES = {
  P: {
    obstacle: false,
    description: "plains",
  },
  M: {
    obstacle: true,
    description: "mountains",
  },
  C: {
    obstacle: true,
    description: "crevasse",
  },
};

const STATUS_CODES = ["OK", "OBSTACLE", "INVALID_COMMAND"];

// top left corner is (X:0, Y:0)
// bottom right is (X:4, Y:4)
const WORLD = [
  ["P", "P", "P", "C", "P"],
  ["P", "M", "P", "C", "P"],
  ["P", "M", "P", "C", "P"],
  ["P", "M", "P", "P", "P"],
  ["P", "M", "P", "P", "P"],
];

const DIRECTIONS = ["N", "S", "E", "W"];
const COMMANDS = ["L", "R", "F", "B"];

// Start: Exercise Code (Your Code)

// YOUR CODE BELOW
// NOTE: cntrl + enter to run tests
// Note: integrated firebug for console logs
// Create new rover
const createRover = (location, direction) => ({
  loc: location,
  dir: direction,
  commands: [],
});

// Enter commands
const enterCommands = (rover, commands) => {
  return {
    ...rover,
    commands: commands,
  };
};

// Execute all commands
const executeCommands = (rover) => {
  let currentRover = { ...rover };
  for (let command of rover.commands) {
    const status = singleCommand(currentRover, command);
    if (status.status !== "OK") {
      return status;
    }
    currentRover = { ...currentRover, ...status };
  }
  return {
    status: "OK",
    loc: currentRover.loc,
    dir: currentRover.dir,
  };
};

// Fire a single command
const singleCommand = (rover, command) => {
  if (!COMMANDS.includes(command)) {
    return {
      status: "INVALID_COMMAND",
      loc: rover.loc,
      dir: rover.dir,
    };
  }

  switch (command) {
    case "L":
      return turnLeft(rover);
    case "R":
      return turnRight(rover);
    case "F":
      return moveRover(rover, 1);
    case "B":
      return moveRover(rover, -1);
  }
};

// Turn left
const turnLeft = (rover) => {
  let newFace = "";
  switch (rover.dir) {
    case "N":
      newFace = "W";
      break;
    case "S":
      newFace = "E";
      break;
    case "E":
      newFace = "N";
      break;
    case "W":
      newFace = "S";
      break;
  }
  return {
    status: "OK",
    loc: rover.loc,
    dir: newFace,
  };
};

// Turn Right
const turnRight = (rover) => {
  let newFace = "";
  switch (rover.dir) {
    case "N":
      newFace = "E";
      break;
    case "S":
      newFace = "W";
      break;
    case "E":
      newFace = "S";
      break;
    case "W":
      newFace = "N";
      break;
  }
  return {
    status: "OK",
    loc: rover.loc,
    dir: newFace,
  };
};

// Move the rover
const moveRover = (rover, step) => {
  let [x, y] = rover.loc;
  switch (rover.dir) {
    case "N":
      y -= step;
      break;
    case "S":
      y += step;
      break;
    case "E":
      x += step;
      break;
    case "W":
      x -= step;
      break;
  }

  //Make sure we're not moving off the map
  if (x < 0 || x >= WORLD[0].length || y < 0 || y >= WORLD.length) {
    return {
      status: "OBSTACLE",
      loc: rover.loc,
      dir: rover.dir,
    };
  }

  //Check for terrain obstacles
  const terrain = WORLD[y][x];
  if (TERRAIN_TYPES[terrain].obstacle) {
    return {
      status: "OBSTACLE",
      loc: rover.loc,
      dir: rover.dir,
    };
  }

  return {
    status: "OK",
    loc: [x, y],
    dir: rover.dir,
  };
};

// Test Specs
mocha.setup("bdd");

const expect = chai.expect;

describe("Mars Rover", function () {
  let rover1 = null;
  beforeEach(function () {
    rover1 = createRover([2, 2], "N");
  });
  describe("When the Mars Rover is initialized", function () {
    it("should set the starting location", function () {
      expect(rover1.loc).to.deep.equal([2, 2]);
    });
    it("should set the starting direction", function () {
      expect(rover1.dir).to.equal("N");
    });
  });
  describe("When the rover receives commands", function () {
    it("should store the commands", function () {
      const commandRover = enterCommands(rover1, ["F", "F", "B"]);
      expect(commandRover.commands).to.deep.equal(["F", "F", "B"]);
    });
    it("should handle invalid commands", function () {
      const commandRover = enterCommands(rover1, ["X"]);
      const status = executeCommands(commandRover);
      expect(status).to.deep.equal({
        status: "INVALID_COMMAND",
        loc: [2, 2],
        dir: "N",
      });
    });
  });
  describe("When the rover executes valid commands", function () {
    describe("When facing north", function () {
      describe("When moving forward", function () {
        it("should move north one tile", function () {
          const commandRover = enterCommands(rover1, ["F"]);
          const status = executeCommands(commandRover);
          expect(status).to.deep.equal({
            status: "OK",
            loc: [2, 1],
            dir: "N",
          });
        });
      });
      describe("When moving backward", function () {
        it("should move south one tile", function () {
          const commandRover = enterCommands(rover1, ["B"]);
          const status = executeCommands(commandRover);
          expect(status).to.deep.equal({
            status: "OK",
            loc: [2, 3],
            dir: "N",
          });
        });
      });
      describe("When turning left", function () {
        it("should be facing west", function () {
          const commandRover = enterCommands(rover1, ["L"]);
          const status = executeCommands(commandRover);
          expect(status).to.deep.equal({
            status: "OK",
            loc: [2, 2],
            dir: "W",
          });
        });
      });
      describe("When turning right", function () {
        it("should be facing east", function () {
          const commandRover = enterCommands(rover1, ["R"]);
          const status = executeCommands(commandRover);
          expect(status).to.deep.equal({
            status: "OK",
            loc: [2, 2],
            dir: "E",
          });
        });
      });
    });
  });
  describe("When the rover encounters obstacles", function () {
    describe("When encountering a mountain", function () {
      it("should stop and return status", function () {
        const commandRover = enterCommands(rover1, ["L", "F"]);
        const status = executeCommands(commandRover);
        expect(status).to.deep.equal({
          status: "OBSTACLE",
          loc: [2, 2],
          dir: "W",
        });
      });
    });
    describe("When encountering a crevasse", function () {
      it("should stop and return status", function () {
        const commandRover = enterCommands(rover1, ["F", "F", "R", "F"]);
        const status = executeCommands(commandRover);
        expect(status).to.deep.equal({
          status: "OBSTACLE",
          loc: [2, 0],
          dir: "E",
        });
      });
    });
    describe("When encountering the edge of the world", function () {
      it("should stop and return status", function () {
        const commandRover = enterCommands(rover1, ["F", "F", "F"]);
        const status = executeCommands(commandRover);
        expect(status).to.deep.equal({
          status: "OBSTACLE",
          loc: [2, 0],
          dir: "N",
        });
      });
    });
  });
  describe("Using moveTo Travel", function () {
    it("travels to endpoint when valid path", function () {
      const rovingRover = moveTo(rover1, [4, 4]);
      expect(rovingRover).to.deep.equal({
        status: "OK",
        loc: [4, 4],
        dir: "E",
      });
    });
    it("does not travel off the map", function () {
      const failingRover = moveTo(rover1, [5, 5]);
      expect(failingRover).to.deep.equal({
        dir: "N",
        loc: [2, 2],
        status: "OBSTRUCTED",
      });
    });
    it("does accept an obstruction as an endpoint", function () {
      const failingRover = moveTo(rover1, [1, 1]);
      expect(failingRover).to.deep.equal({
        dir: "N",
        loc: [2, 2],
        status: "OBSTRUCTED",
      });
    });
  });
});

mocha.run();

// Find Path between two points

let cols = 5; //columns in the grid
let rows = 5; //rows in the grid

let grid = new Array(cols); //array of all the grid points

let openSet = []; //array containing unevaluated grid points
let closedSet = []; //array containing completely evaluated grid points

let start; //starting grid point
let end; // ending grid point (goal)
let path = [];

function heuristic(position0, position1) {
  let d1 = Math.abs(position1.x - position0.x);
  let d2 = Math.abs(position1.y - position0.y);

  return d1 + d2;
}

//constructor function to create all the grid points as objects containind the data for the points
function GridPoint(x, y, obstruct) {
  this.x = x; //x location of the grid point
  this.y = y; //y location of the grid point
  this.f = 0; //total cost function
  this.g = 0; //cost function from start to the current grid point
  this.h = 0; //heuristic estimated cost function from current grid point to the goal
  this.obstruct = obstruct;
  this.neighbors = []; // neighbors of the current grid point
  this.parent = undefined; // immediate source of the current grid point
  // update neighbors array for a given grid point
  this.updateNeighbors = function (grid) {
    let i = this.x;
    let j = this.y;
    if (i < cols - 1) {
      let newNeighbor = grid[i + 1][j];
      if (newNeighbor.obstruct === "P") {
        this.neighbors.push(grid[i + 1][j]);
      }
    }
    if (i > 0) {
      let newNeighbor = grid[i - 1][j];
      if (newNeighbor.obstruct === "P") {
        this.neighbors.push(grid[i - 1][j]);
      }
    }
    let newNeighbor = grid[i][j + 1];

    if (j < rows - 1) {
      if (newNeighbor.obstruct === "P") {
        this.neighbors.push(grid[i][j + 1]);
      }
    }
    if (j > 0) {
      let newNeighbor = grid[i][j - 1];

      if (newNeighbor.obstruct === "P") {
        this.neighbors.push(grid[i][j - 1]);
      }
    }
  };
}

//initializing the grid
function init(startPoint, endPoint) {
  const [sx, sy] = startPoint;
  const [ex, ey] = endPoint;
  //making a 2D array
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = WORLD[i][j];
      grid[i][j] = new GridPoint(i, j, x);
    }
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].updateNeighbors(grid);
    }
  }

  start = grid[sx][sy];
  end = grid[ex][ey];

  openSet.push(start);
}

//A star search implementation

function search(startPoint, endPoint, rover) {
  if ((endPoint[1] || endPoint[0]) > WORLD[0].length - 1) {
    return {
      loc: rover.loc,
      status: "OBSTRUCTED",
      dir: rover.dir,
    };
  }

  if (WORLD[endPoint[0]][endPoint[1]] !== "P") {
    return {
      loc: rover.loc,
      status: "OBSTRUCTED",
      dir: rover.dir,
    };
  }

  init(startPoint, endPoint);
  while (openSet.length > 0) {
    //assumption lowest index is the first one to begin with
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }
    let current = openSet[lowestIndex];

    if (current === end) {
      let temp = current;
      path.push(temp);
      while (temp.parent) {
        path.push(temp.parent);
        temp = temp.parent;
      }
      path.reverse();
      const returnPath = path.map((path) => [path.x, path.y]);
      // return the traced path
      return returnPath;
    }

    //remove current from openSet
    openSet.splice(lowestIndex, 1);
    //add current to closedSet
    closedSet.push(current);

    let neighbors = current.neighbors;
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      if (!closedSet.includes(neighbor)) {
        let possibleG = current.g + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (possibleG >= neighbor.g) {
          continue;
        }

        neighbor.g = possibleG;
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
      }
    }
  }

  //no solution by default
  return [];
}
// travel path

const moveTo = (rover, endCoords) => {
  const startPoint = rover.loc;
  const travelPathway = search(startPoint, [endCoords[1], endCoords[0]], rover);
  let commands = [];
  let directionRover = { ...rover };
  // if travelPathway is not valid, it is an OBSTRUCTED rover
  if (Array.isArray(travelPathway)) {
    for (let i = 0; i < travelPathway.length - 1; i++) {
      const currentStep = travelPathway[i];
      const nextStep = travelPathway[i + 1];
      if (nextStep[1] > currentStep[1] && directionRover.dir === "E") {
        commands.push("F");
      }
      if (nextStep[1] > currentStep[1] && directionRover.dir === "N") {
        commands.push("R", "F");
        directionRover.dir = "E";
      }
      if (nextStep[1] > currentStep[1] && directionRover.dir === "W") {
        commands.push("R", "R", "F");
        directionRover.dir = "E";
      }
      if (nextStep[1] > currentStep[1] && directionRover.dir === "S") {
        commands.push("L", "F");
        directionRover.dir = "E";
      }
      if (currentStep[1] > nextStep[1] && directionRover.dir === "W") {
        commands.push("F");
      }
      if (currentStep[1] > nextStep[1] && directionRover.dir === "N") {
        commands.push("L", "F");
        directionRover.dir = "W";
      }
      if (currentStep[1] > nextStep[1] && directionRover.dir === "E") {
        commands.push("R", "R", "F");
        directionRover.dir = "W";
      }

      if (currentStep[1] > nextStep[1] && directionRover.dir === "S") {
        commands.push("R", "F");
        directionRover.dir = "W";
      }
      if (currentStep[0] > nextStep[0] && directionRover.dir === "N") {
        commands.push("F");
      }
      if (currentStep[0] > nextStep[0] && directionRover.dir === "E") {
        commands.push("L", "F");
        directionRover.dir = "N";
      }
      if (currentStep[0] > nextStep[0] && directionRover.dir === "W") {
        commands.push("R", "F");
        directionRover.dir = "N";
      }

      if (currentStep[0] > nextStep[0] && directionRover.dir === "S") {
        commands.push("R", "R", "F");
        directionRover.dir = "N";
      }
      if (nextStep[0] > currentStep[0] && directionRover.dir === "S") {
        commands.push("F");
      }
      if (nextStep[0] > currentStep[0] && directionRover.dir === "N") {
        commands.push("R", "R", "F");
        directionRover.dir = "S";
      }
      if (nextStep[0] > currentStep[0] && directionRover.dir === "E") {
        commands.push("R", "F");
        directionRover.dir = "S";
      }
      if (nextStep[0] > currentStep[0] && directionRover.dir === "W") {
        commands.push("L", "F");
        directionRover.dir = "S";
      }
    }
    const enterRoverCommands = enterCommands(rover, commands);
    const makeRoverTravel = executeCommands(enterRoverCommands);
    return makeRoverTravel;
  } else return travelPathway;
};
