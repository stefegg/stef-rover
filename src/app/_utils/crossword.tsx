import "./styles.css";

let gameGrid: string[][] = [[]];

for (let i = 0; i < 5; i++) {
  gameGrid[i] = new Array("_", "_", "_", "_", "_");
}

type GameWord = {
  clue: string;
  answer: string;
  direction: "down" | "across";
  coordinate: number[];
};
type GameData = GameWord[];

const gameData: GameData = [
  {
    clue: "man shine in the sky during the night",
    answer: "star",
    direction: "down",
    coordinate: [0, 1],
  },
  {
    clue: "shine in the day",
    answer: "sun",
    direction: "across",
    coordinate: [0, 1],
  },
  {
    clue: "moves tall ships",
    answer: "sail",
    direction: "across",
    coordinate: [4, 1],
  },
  {
    clue: "death and ______",
    answer: "taxes",
    direction: "across",
    coordinate: [2, 0],
  },
  {
    clue: "abbreviation for new years",
    answer: "nye",
    direction: "down",
    coordinate: [0, 3],
  },
  {
    clue: "clue #2s official name",
    answer: "sol",
    direction: "down",
    coordinate: [2, 4],
  },
];

const createTodaysGame = (gameData: GameData, gameGrid: string[][]) => {
  gameData.map((gameItem, idx) => {
    if (gameItem.direction === "down") {
      for (let i = 0; i < gameItem.answer.length; i++) {
        gameGrid[gameItem.coordinate[0] + i][gameItem.coordinate[1]] =
          gameItem.answer[i];
      }
    }
    if (gameItem.direction === "across") {
      for (let i = 0; i < gameItem.answer.length; i++) {
        gameGrid[gameItem.coordinate[0]][gameItem.coordinate[1] + i] =
          gameItem.answer[i];
      }
    }
  });
};

createTodaysGame(gameData, gameGrid);

export default function App() {
  return (
    <div className="App">
      {gameGrid.map((row, idx) => (
        <div key={idx} className="row">
          {row.map((cell, index) =>
            cell !== "_" ? (
              <div className={`gameCell`} key={idx}>
                {cell}
              </div>
            ) : (
              <div key={index} className="cell"></div>
            )
          )}
        </div>
      ))}
    </div>
  );
}
