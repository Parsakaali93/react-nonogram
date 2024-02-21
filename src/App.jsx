import { useEffect, useState } from "react";

let gridSizeX = 5
let gridSizeY = 5
let statusText = "PICROSS"

function TopClues(props)
{
  const topClueHolders = props.clues.map(clue => (
    <TopClue clues={clue}/>
    ))
  
  return (
    <div className="top-clues">
      {topClueHolders}
      </div>
  )
}

function TopClue(props) {
  const tClues = props.clues.map(clue => (
    <div className="clue" style={{height:`${100 / (gridSizeY/(2)+1)}%`, width:`100%`}}><p className="clueNum">{clue}</p></div>
    ))
  
    return (
        <div className="top-clue-holder" style={{width:`${100/gridSizeX}%`}}>{tClues}</div>
    )
}

function LeftClues(props)
{
  const leftClueHolders = props.clues.map(clue => (
    <LeftClue clues={clue}/>
    ))
  
  return (
    <div className="left-clues">
      {leftClueHolders}
      </div>
  )
}

function LeftClue(props) {
  const lClues = props.clues.map(clue => (
    <div className="clue"  style={{width:`${100 / (gridSizeX/(2)+1)}%`, height:`100%`}}><p className="clueNum">{clue}</p></div>
    ))
  
    return (
        <div className="left-clue-holder" style={{height:`${100/gridSizeY}%`}}>{lClues}</div>
    )
}

function Tile(props) {  
    function tileClassName(t){
      console.log("t" + t)
      switch(t)
        {
            case 0:
            return 'white-cell'
            
            case 1:
            return 'black-cell'
            
            case 2:
            return 'pink-cell'
            
            default:
            return 'white-cell'
        }
    }
  
    return (
        <div onClick={props.toggleTile} className={tileClassName(props.current)}></div>
    )
}

function Grid() {
  
  const[tiles, setTiles] = useState([]) // Game board tiles
  const [leftClues, setLeftClues] = useState([]) // Number clues on the left
  const [topClues, setTopClues] = useState([]) // Number clues on top
  const [number, setNumber] = useState(5); // This is the selected game grid size for new game
  
    const [fillPercent, setFillPercent] = useState(60); // Amount of black tiles in a completed puzzle as a percentage
  
  const [decoyTool, setDecoyTool] = useState(false);
  
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setNumber(newValue);
  };
  
   const handleFillChange = (event) => {
    const newValue = event.target.value;
    setFillPercent(newValue);
  };
  
  function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the     minimum is inclusive 
  }

  // Create a tile object
  function generateTile(id)
  {
    let rand = getRandomIntInclusive(0, 100)
    let t = rand < fillPercent ? 1 : 0
    return(
      {
        target: t,
        current: 0,
        id: id
      }
    )
  }
  
  // Set state to an array full of tile objects
  function generateGameBoard()
  {
    let gameTiles = []
    
    for(let x = 0; x < gridSizeX; x++)
    {
        const row = []
      
        for(let y = 0; y < gridSizeY; y++)
        { 
            row.push(generateTile(x.toString() + " " + y.toString()))
        }
        gameTiles.push(row)

    }

    setTiles(gameTiles)
  }
  
  
  function generateLeftClues() 
  {
    const c = []
    // ROW
    for(let y = 0 ; y < gridSizeY; y++)
      {
         let thisRowLeftClues = [] 
         let consecutiveBlacks = 0
        
         //COLUMN
         for(let x = 0; x < gridSizeX; x++)
         {
               // If this tile should be black
               // If this tile should be black
               if(tiles[y][x].target == 1)
               {
                  consecutiveBlacks++
                 
                 if(x == gridSizeX-1)
                   {
                     thisRowLeftClues.unshift(consecutiveBlacks)
                     consecutiveBlacks = 0
                   }
               }
           
              else if(tiles[y][x].target == 0 && consecutiveBlacks > 0)
              {
                  thisRowLeftClues.unshift(consecutiveBlacks)
                  consecutiveBlacks = 0
              }
           
           //thisRowLeftClues.unshift(tiles[y][x].target)
         }
        
        if(thisRowLeftClues.length == 0)
             thisRowLeftClues.push(0)

            c.push(thisRowLeftClues);
      }
    
        setLeftClues(c)
  }
  
  function generateTopClues() 
  {
    const c = []
    // ROW
    for(let y = 0 ; y < gridSizeY; y++)
      {
         let thisRowTopClues = [] 
         let consecutiveBlacks = 0
        
         //COLUMN
         for(let x = 0; x < gridSizeX; x++)
         {
               // If this tile should be black
               if(tiles[x][y].target == 1)
               {
                  consecutiveBlacks++
                 
                 if(x == gridSizeX-1)
                   {
                     thisRowTopClues.unshift(consecutiveBlacks)
                     consecutiveBlacks = 0
                   }
               }
           
              else if(tiles[x][y].target == 0 && consecutiveBlacks > 0)
              {
                  thisRowTopClues.unshift(consecutiveBlacks)
                  consecutiveBlacks = 0
              }
           
           //thisRowLeftClues.unshift(tiles[y][x].target)
         }
        
        if(thisRowTopClues.length == 0)
             thisRowTopClues.push(0)

            c.push(thisRowTopClues);
      }
    
        setTopClues(c)
  }
  
  // Function to change the status of a tile from black to white and vice versa
  function toggleTile(id) {
    console.log(id)
        setTiles(nested => nested.map(oldTile => oldTile.map(tile =>         {
            if( tile.id === id ) 
            {
                if(!decoyTool)
                {
                  if(tile.current == 0)
                    return {...tile, current: 1} 
                  
                  else if(tile.current == 1)
                    return {...tile, current: 0}
                  
                  else
                    return tile
                }
              
                else if(decoyTool)
                {
                  if(tile.current == 0)
                    return {...tile, current: 2} 
                  
                  else if(tile.current == 2)
                    return {...tile, current: 0}
                  
                  else
                    return tile
                }
            }
          
            else
               return tile
        })))
    
    }
    
  function checkForGameWon()
  {
    let won = true;
    
    for(let x = 0; x < gridSizeX; x++)
      for(let y = 0; y < gridSizeY; y++)
        {
          if((tiles[x][y].current != 1 && tiles[x][y].target == 1) || (tiles[x][y].target == 0 && tiles[x][y].current == 1))
            {
              statusText = "PICROSS"
              return
            }
        }
    
    statusText = "YOU WON!"
  //   confetti({
  //   particleCount: 200,
  //   spread: 120,
  //   origin: { y: 0.6 },
  // });
  }
  
      // Generate tiles on page load
    useEffect(() => {
    generateGameBoard()
  }, [])
  
  useEffect(() => {
    if(tiles.length > 0){
     generateLeftClues()
      generateTopClues()
      checkForGameWon()
      

    }
    
  }, [tiles])
  
  // Map tile array to tiles JSX objects
    const gameBoard = tiles.map(nested => nested.map(tile => (
        <Tile className="cell" 
            target={tile.target} 
            current={tile.current}
            id={tile.id}
            toggleTile={() => toggleTile(tile.id)}
        />)
    ))
    
    const gridStyle = {
      gridTemplateColumns: `repeat(${gridSizeX}, ${100 / gridSizeX}%)`,
      gridTemplateRows: `repeat(${gridSizeY}, ${100 /             gridSizeY}%)`
    }
    
  function newGame()
  {
    gridSizeX = number;
    gridSizeY = number;
    generateGameBoard();
  }
    
    // Return a board div with all the tiles nested within
    return (
      <div className="gameAreaAndMenu">
        
        <div className="gameArea">
          <div className="empty"> </div>
          <div className="nonogram-board" id="scaling-element" style={gridStyle}>  {gameBoard}      </div>
          <LeftClues clues={leftClues} />
          <TopClues clues={topClues} />
        </div>
        
        <div className="menu">
          <h2>{statusText}</h2>
          <button onClick={() => setDecoyTool(old => !old)} className="tool">{decoyTool ? '🚩' : '⬛'}</button>
          <div style={{ display: 'flex', alignItems:'center', justifyContent:'center', gap:'20px', flexDirection:'row' }}>
            <div style={{ display: 'flex', alignItems:'center',     justifyContent:'center', flexDirection:'column' }}>
            <label htmlFor="numberInput">Board Size:</label>
            <input
              type="number"
              id="numberInput"
              name="numberInput"
              min="5"
              max="25"
              value={number}
              onChange={handleInputChange}
            /> 
            </div>
            <div style={{ display: 'flex', alignItems:'center',     justifyContent:'center', flexDirection:'column' }}>
            <label htmlFor="numberInput">Fill %:</label>
            <input
              type="number"
              id="fillInput"
              name="fillInput"
              min="10"
              max="90"
              value={fillPercent}
              onChange={handleFillChange}
            /> 
            </div>
          </div>
          <button className="newgame" onClick={newGame}>New Game</button>
        </div>
        
      </div>
      )
}

// App object renders the grid
function App() {
    return (
      <Grid />
    )

}
 
export default App