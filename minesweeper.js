//HELPER FUNCTIONS

    //helper function to change any single digit input into a 2 digit input i.e digitize(5) = "05" - to be used to make 
        function digitize(input) {
            input = input.toString();
            if(input.length === 1) {
                return `0${input}`;
            } else {
                return input;
            }
        }
    //return tile object by id, searching the generatedTileObjects array
        function getTileObject(inputCoordinate){
            return generatedTileObjects.filter((x) => x.coordinate = inputCoordinate);
        }

        //checks if coordinates are within the grid boundaries
        function checkCoordinates(coordinate) {
            let XCoordinate = coordinate.slice(0,2);
            let YCoordinate = coordinate.slice(2,4);
            return!(XCoordinate < 1 || XCoordinate > gridWidth || YCoordinate < 1 || YCoordinate > gridHeight)
        }

        function getSurroundingTiles(){
            //array of the relative positions of the surrounding tiles
            const surroundingTilesArray = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];
            let outputArray = [];
            surroundingTilesArray.forEach((x) => {
                let XCoordToCheck = XCoord + x[0];
                let YCoordToCheck = YCoord + x[1];
                let coordToCheck = digitize(XCoordToCheck) + digitize(YCoordToCheck);
                //checks the resulting coordinate to see if it's within the boundaries, i.e the top left corner will not have a coordinate to its left or top
                if(checkCoordinates(coordToCheck)){
                    outputArray.push(coordToCheck);
                }
            })
            return outputArray;
        }

//
    class tileObject {
        content;
        clickstate;
        constructor(inputCoordinate){
            if(!/\w{4}$/.test(inputCoordinate)) {
                throw "must construct tile class using a string coordinate"
            }
            this.coordinate = inputCoordinate;
        }
        countSurroundingBombs(){
            const surroundingTilesArray = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];
            let XCoord = Number(this.coordinate.slice(0,2));
            let YCoord = Number(this.coordinate.slice(2,4));
            let netSurroundingBombs = 0;
            surroundingTilesArray.forEach((x) => {
                let XCoordToCheck = XCoord + x[0];
                let YCoordToCheck = YCoord + x[1];
                let CoordToCheck = digitize(XCoordToCheck) + digitize(YCoordToCheck);
                //checks the resulting coordinate to see if it's within the boundaries, i.e the top left corner will not have a coordinate to its left or top
                if(checkCoordinates(CoordToCheck)){
                    //checks if the resulting coordinate has a bomb. if it does, increment netSurroundingBombs
                    if(document.getElementById(CoordToCheck).innerText === 'B'){
                        netSurroundingBombs++;
                    }
                }
            })
            this.content = netSurroundingBombs.toString();
        }
        clickTile(){
            if(this.content = "B") {
                gameOver();
            } else {
                document.getElementById(this.coordinate).innerText = this.content.toString();
                if(this.content === "0") {
                    getSurroundingTiles(this.coordinate).forEach((x) => {
                        getTileObject(x).clickTile;
                    })
                }
            }
        }
    }
    //Main functions
        //generates a grid with with each element having its respective coordinate as the ID, 
        //storing the gridWidth, gridHeight and all tiles as global variables
            var gridWidth;
            var gridHeight;
            var generatedTiles = [];
            var generatedTileObjects = [];
            function generateGrid(width, height){
                let output = document.createElement('div');
                output.style.border = '2px solid black';
                output.style.margin = '25px auto';
                output.style.display = 'inline-block';
                for( i = 0; i < height; i++ ){
                    let row = document.createElement('div');
                    row.style.height = '32px';
                    for( j = 0; j < width; j++){
                        let tileElement = document.createElement('p');
                        //grid is created top-down so the id is calculated such that bottom left grid tile is 11, stored as a string
                        let generatedId = digitize([j + 1]) + digitize([height - i]);
                        tileElement.id = generatedId;
                        //created element is added to the generated tiles array then appended to the row
                        generatedTiles.push(generatedId);
                        tileElement.className = 'gridTile';
                        row.appendChild(tileElement);
                        let generatedObject = new tileObject(generatedId);
                        generatedTileObjects.push(generatedObject);
                    }
                    output.appendChild(row);
                }
                console.log(`Generated ${width} by ${height} grid`);
                return output;
            }

        //setting up the bomb locations
            var bombLocations = [];
            function gridSetup(numOfBombs){
                for(i = 0 ; i < numOfBombs ; i++){
                    let XCoordOfBomb = Math.floor(Math.random() * (gridWidth - 0.999) + 1);
                    let YCoordOfBomb = Math.floor(Math.random() * (gridHeight - 0.999) + 1);
                    let coordOfBomb = digitize(XCoordOfBomb) + digitize(YCoordOfBomb);
                    document.getElementById(coordOfBomb).innerText = 'B';
                    bombLocations.push(coordOfBomb);
                }
                generatedTiles.forEach((tile) => {
                    let tileElement = document.getElementById(tile);
                    if((tileElement.innerText !== 'B')){
                        let numOfSurroundingBombs = countSurroundingBombs(tile);
                        console.log(`net surrounding bombs = ${numOfSurroundingBombs}`);
                        tileElement.innerText = numOfSurroundingBombs;
                    }
                })
            }