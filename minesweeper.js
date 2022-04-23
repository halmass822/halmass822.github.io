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
            return generatedTileObjects.filter((x) => x.coordinate === inputCoordinate)[0];
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

    //class to represent each tile to limit interactions with the elements
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
                //gameOver();
            } else {
                document.getElementById(this.coordinate).innerText = this.content.toString();
                if(this.content === "0") {
                    getSurroundingTiles(this.coordinate).forEach((x) => {
                        getTileObject(x).clickTile;
                    })
                }
            }
            this.clickstate = true;
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
                    row.style.height = '42px';
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
                gridWidth = width;
                gridHeight = height;
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
                    getTileObject(coordOfBomb).content = "B";
                    bombLocations.push(coordOfBomb);
                }
                generatedTileObjects.forEach((tileObj) => {
                    tileObj.countSurroundingBombs();
                })
            }

document.getElementById('gridContainer').appendChild(generateGrid(10,10));
gridSetup(10);
generatedTileObjects.forEach((x) => {
    x.countSurroundingBombs();
})

//event listeners
    //right click to "flag" the tile, turn the color red
    document.body.addEventListener('contextmenu',(event) => {
        if(event.target.className === 'gridTile'){
            let targetObject = getTileObject(event.target.id);
            if(!targetObject.clickstate){
                if(event.target.style.backgroundColor !== 'red'){
                    event.target.style.backgroundColor = 'red';
                } else {
                    event.target.style.backgroundColor = 'lightgray';
                }   
            }
        }
        event.preventDefault();
        return false;
    })
    
    //right click to trigger target tile object's clickTile()
    document.body.addEventListener('click',(event) => {
        if(event.target.className === 'gridTile'){
            let targetObject = getTileObject(event.target.id);
            console.log(targetObject);
            if(!targetObject.clickstate){
                targetObject.clickTile();
            }
        }
    })