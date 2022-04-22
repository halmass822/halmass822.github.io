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

//generates a grid with with each element having its respective coordinate as the ID, 
//storing the gridWidth, gridHeight and all tiles as global variables
var gridWidth;
var gridHeight;
var generatedTiles = [];
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
        }
        output.appendChild(row);
    }
    console.log(`Generated ${width} by ${height} grid`);
    return output;
}