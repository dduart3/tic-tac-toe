const player = (marker) =>{
    return{marker};
}

const gameBoard = (()=>{
    const state = {
        tiles: Array(9).fill(null),
        playerOne: player('X'),
        playerTwo: player('O'),
        xIsNext: () => true
    }

    const setMarker = (tileIndex) => (tileIndex)=> (state.xIsNext) ? state.tiles[tileIndex] = state.playerOne.marker : state.tiles[tileIndex] = state.playerTwo.marker;
    
    const toggleTurn = () => ()=> (state.xIsNext) ? state.xIsNext = false : state.xIsNext = true;
    
    const hasMovementsLeft = (tiles) => (tiles)=> tiles.includes(null);

    const resetTiles = () => state.tiles = Array(9).fill(null);

    const calculateWinner = (tiles) => {

      return ()=>{
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
  
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if(tiles[a] && tiles[a] === tiles[b] && tiles[a] === tiles[c]) {
            return tiles[a];
          }
        }
        return null;
      }
    }
    return{state, toggleTurn, setMarker, hasMovementsLeft, calculateWinner, resetTiles};
})();


const displayController = (()=>{
    
    const tileElements =  Array.from (document.querySelectorAll('.gameboard-column__tile'));

    const resetButton = document.querySelector('.reset-button');

    const showResetButton = (boolean) => (boolean)=> (boolean) ? resetButton.classList.remove('hiden') : resetButton.classList.add('hiden');
    
    const getTileIndex = (tile) => tile.dataset.tileIndex; 

    const setElementMarker = (tile) => (tile)=> (gameBoard.state.xIsNext) ? tile.textContent = gameBoard.state.playerOne.marker :  tile.textContent = gameBoard.state.playerTwo.marker;

    const resetElementTiles = () => tileElements.map(tile => tile.textContent = "");


    return {tileElements, setElementMarker, getTileIndex, resetButton, showResetButton, resetElementTiles};
})();



const game = (() =>{
  
  const winnerTitleElement = document.querySelector('.winner');
  
  const tileElements = displayController.tileElements;
  
  const setMarker = gameBoard.setMarker();

  const setElementMarker = displayController.setElementMarker();

  const toggleTurn =  gameBoard.toggleTurn();

  const resetButton = displayController.resetButton;

  const showResetButton = displayController.showResetButton();

  
  const resetGame = () =>{
    gameBoard.resetTiles();
    displayController.resetElementTiles()
    showResetButton(false);
    winnerTitleElement.textContent = "";
  }
  
  resetButton.addEventListener('click', resetGame);

  
  const play = (event) =>{
    
    const clickedTile = event.target;
    
    const tiles = gameBoard.state.tiles;
    
    const hasMovementsLeft = gameBoard.hasMovementsLeft();
    
    const isTileSelected = (clickedTile.textContent !== "");
    
    const winner = gameBoard.calculateWinner(tiles);
    
    const tileIndex = displayController.getTileIndex(clickedTile);


    if(!isTileSelected){
      setMarker(tileIndex);
      setElementMarker(clickedTile);
      toggleTurn();
    }


    if(winner() !== null ){
      winnerTitleElement.textContent = `The winner is: ${winner()}`;
      showResetButton(true);
    }
    
    
    if(winner() === null && !hasMovementsLeft(tiles)){
      winnerTitleElement.textContent = 'The game is tied';
      showResetButton(true);
    }
  }
    
    const init = ()=> tileElements.map(tile => tile.addEventListener('click', play));

    return {init};
})();

game.init();









