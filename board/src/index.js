import * as dat from "dat.gui";
//importing chessborad component
import "./components/ChessBoard.js";


/* - Here we initialize the board by creating the board element in the HTML.
   - Then we set the initial position if the chess pieces.
   - The initial sequence is the following:
      - the lowercase are for the black pieces
      - the eights are for the blank cells
      - the uppercase are for the white pieces
*/
const board = document.createElement("chess-board");
board.setFromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w");


/* Here we are using dat.GUI library as a sking controller.
    - when we initialize the library, we set the options for
      pieces and themes and inside those options we create the
      different skins */

const gui = new dat.GUI();

const options = {
  pieces: "normal",
  theme: "wood"
};

gui.add(options, "pieces", ["normal", "pixel" ])
  .onChange(data => board.changePieces(data));

gui.add(options, "theme", ["wood", "future", "pokemon", "classic", "pikachu"])
  .onChange(data => {
    const chessboard = document.querySelector("chess-board");
    chessboard.classList.remove("wood", "future", "pokemon", "classic", "pikachu");
    chessboard.classList.add(data);
  });

gui.close();

