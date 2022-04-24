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
        //returns an array of all the coordinates of the surrounding tiles, automatically omitting invalid coordinates (like at corners)
        function getSurroundingTiles(centerCoord){
            //array of the relative positions of the surrounding tiles
            const XCoord = Number(centerCoord.slice(0,2));
            const YCoord = Number(centerCoord.slice(2,4));
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

        //changes the related tile element to show the tile contents at the appropriate color
        function revealTile(coordinate, content) {
            if(content){
                let outputColor;
                switch(content) {
                    case "1":
                        outputColor = "blue";
                        document.getElementById(coordinate).innerText = content; 
                        document.getElementById(coordinate).style.color = outputColor; 
                    break;
                    case "2":
                        outputColor = "green";
                        document.getElementById(coordinate).innerText = content; 
                        document.getElementById(coordinate).style.color = outputColor; 
                    break;
                    case "3":
                        outputColor = "red";
                        document.getElementById(coordinate).innerText = content; 
                        document.getElementById(coordinate).style.color = outputColor; 
                    break;
                    case "4":
                        outputColor = "dark-blue";
                        document.getElementById(coordinate).innerText = content; 
                        document.getElementById(coordinate).style.color = outputColor; 
                    break;
                    case "5":
                        outputColor = "dark-red";
                        document.getElementById(coordinate).innerText = content; 
                        document.getElementById(coordinate).style.color = outputColor; 
                    break;
                    case "6":
                        outputColor = "pink";
                        document.getElementById(coordinate).innerText = content; 
                        document.getElementById(coordinate).style.color = outputColor; 
                    break;
                    case "7":
                        outputColor = "yellow";
                        document.getElementById(coordinate).innerText = content; 
                        document.getElementById(coordinate).style.color = outputColor; 
                    break;
                    case "8":
                        outputColor = "purple";
                        document.getElementById(coordinate).innerText = content; 
                        document.getElementById(coordinate).style.color = outputColor; 
                    break;
                    case "B":
                        outputColor = "black"
                        document.getElementById(coordinate).innerText = content; 
                        document.getElementById(coordinate).style.color = outputColor; 
                    break;
                    case "0":
                        document.getElementById(coordinate).style.backgroundColor = "#B2B8B8";
                        outputColor = "black";
                    break;
                    default:
                        throw `coordinate ${coordinate} content ${content}`
                }
            }
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
            if (this.content !== "B"){
                const surroundingTilesArray = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];
                let XCoord = Number(this.coordinate.slice(0,2));
                let YCoord = Number(this.coordinate.slice(2,4));
                let netSurroundingBombs = 0;
                surroundingTilesArray.forEach((x) => {
                    let XCoordToCheck = XCoord + x[0];
                    let YCoordToCheck = YCoord + x[1];
                    let coordToCheck = digitize(XCoordToCheck) + digitize(YCoordToCheck);
                    //checks the resulting coordinate to see if it's within the boundaries, i.e the top left corner will not have a coordinate to its left or top
                    if(checkCoordinates(coordToCheck)){
                        //checks if the resulting coordinate has a bomb. if it does, increment netSurroundingBombs
                        if(getTileObject(coordToCheck).content === 'B'){
                            netSurroundingBombs++;
                        }
                    }
                })
                this.content = netSurroundingBombs.toString();
            }
        }
        clickTile(){
            this.clickstate = true;
            document.getElementById(this.coordinate).backgroundColor = "lightgray"
            if(this.content === "B") {
                gameOver();
            } else {
                revealTile(this.coordinate,this.content);
                if(this.content === "0") {
                    getSurroundingTiles(this.coordinate).forEach((x) => {
                        if(!getTileObject(x).clickstate){
                            getTileObject(x).clickTile();
                        }
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
                    let coordOfBomb;
                    do {
                        let XCoordOfBomb = Math.floor(Math.random() * (gridWidth - 0.999) + 1);
                        let YCoordOfBomb = Math.floor(Math.random() * (gridHeight - 0.999) + 1);
                        coordOfBomb = digitize(XCoordOfBomb) + digitize(YCoordOfBomb);
                    } while (bombLocations.includes(coordOfBomb));
                    getTileObject(coordOfBomb).content = "B";
                    bombLocations.push(coordOfBomb);
                }
                generatedTileObjects.forEach((tileObj) => {
                    tileObj.countSurroundingBombs();
                })
                generatedTileObjects.forEach((x) => {
                    x.countSurroundingBombs();
                })
            }
        
        //sets all tile objects click states to false, content to "", reset innertext and background color and reset the image
        var images = ['faceImage','clickImage','gameoverImage','victoryImage']; //array with all the image ids
        var difficulty = 10; //to be changed later when adding different difficulties
        var gameRunning = false;
        function startGame(){
            console.log(`startGame() triggered`);
            bombLocations = [];
            generatedTileObjects.forEach((x) => {
                x.clickstate = false;
                x.content = "";
                document.getElementById(x.coordinate).style.backgroundColor = "lightgray";
                document.getElementById(x.coordinate).innerText = "";
            });
            images.forEach((x) => document.getElementById(x).style.display = "none");
            document.getElementById('faceImage').style.display = "block";
            gridSetup(difficulty);
            gameRunning = true;
        }

        function gameOver(){
            gameRunning = false;
            bombLocations.forEach((x) => revealTile(x,"B"));
            images.forEach((x) => document.getElementById(x).style.display = "none");
            document.getElementById('gameoverImage').style.display = "block";
        }

document.getElementById('gridContainer').appendChild(generateGrid(10,10));
document.getElementById('faceImage').style.display = "block";

//event listeners
    //right click to "flag" the tile, turn the color red
    document.body.addEventListener('contextmenu',(event) => {
        if(gameRunning){
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
        }
    })
    
    //right click to trigger target tile object's clickTile()
    document.body.addEventListener('click',(event) => {
        if(gameRunning){
            if(event.target.className === 'gridTile'){
                let targetObject = getTileObject(event.target.id);
                if(!targetObject.clickstate){
                    targetObject.clickTile();
                }
            }
        }
    })

    document.getElementById('gameoverImage').addEventListener('click',startGame);
    document.getElementById('faceImage').addEventListener('click',startGame);

    //trigger the click image on mousedown and reverse on mouseup
    document.getElementById("gridContainer").addEventListener('mousedown',() => {
        if(gameRunning){
            document.getElementById('faceImage').style.display = "none";
            document.getElementById('clickImage').style.display = "block";
        }
    })

    document.getElementById("gridContainer").addEventListener("mouseup",() => {
        if(gameRunning){
            document.getElementById('clickImage').style.display = "none";
            document.getElementById('faceImage').style.display = "block";
        }
    })

//debugging functions
    //reveals all tile contents without triggering the clickTile() method
    function debugReveal() {
        generatedTileObjects.forEach((x) => {
            document.getElementById(x.coordinate).innerText = x.content;
        })
    }