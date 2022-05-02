    //returns an array of 4 random colors from the colors array
    function getRandomPegs() {
        const colors = ['blue','green','red','yellow','pink','orange'];
        const getPeg = () => colors[(Math.floor(Math.random() * (colors.length - 0.001)))];
        const output = [getPeg(),getPeg(),getPeg(),getPeg()];
        return output;
    }

    var winningPegs = getRandomPegs();

    //returns an array of all the related elements to that guessNumber - index 0 - 3 are the guesses, 4-7 are the responses
    function getElements(guessNumber) {
        let outputArray = [];
        const guessIds = [];
        const responseIds = [];
        //gets all the element ids and pushes them to the respective array
        for(i = 1; i < 5; i++) {
            guessIds.push(`guess${guessNumber}${i}`);
            responseIds.push(`response${guessNumber}${i}`);
        }
        //gets the elements from the arrays and pushes them to the output array
        guessIds.forEach((x) => {
            outputArray.push(document.getElementById(x));
        })
        responseIds.forEach((x) => {
            outputArray.push(document.getElementById(x));
        })
        const buttonElement = document.getElementById(`submit${guessNumber}`);
        outputArray.push(buttonElement);
        return outputArray;
    }

    //represents each guess. stores the users input, methods to check the guess and reset the guess. by default interactable property is false
    //has a static method to get the guessBox object by any related element id
        //9 guessBox objects are created and pushed to the guessBoxObjects array, see the line below this class
        var guessBoxObjects = [];
    class guessBox {
        guessNumber;
        guesses;
        interactable;
        elements;
        constructor(inputGuessNumber){
            this.guessNumber = inputGuessNumber.toString();
            this.guesses = [,,,,];
            this.interactable = false;
        }
        reset(){
            this.guesses = [,,,,];
            this.elements.forEach((x) => x.style.backgroundColor = "lightgray");
            this.elements[0].parentElement.style.backgroundColor = "white";
            this.elements[8].innerText = "Submit";
            this.elements[8].removeEventListener('click',startGame);
            this.elements[8].style.backgroundColor = "white";
            this.interactable = false;
        }
        checkGuess() {
            if(this.interactable){
                let blackPegs = 0;
                let whitePegs = 0;
                for(i = 0; i < 4; i++){
                    if(winningPegs.includes(this.guesses[i])){
                        if(winningPegs[i] === this.guesses[i]){
                            whitePegs++;
                        } else {
                            blackPegs++;
                        }
                    }
                }
                //this.elements contains an array of both the guess and response elements, responses starting at index 4
                //incrementor to move the index over and target the next response element
                let indexIncrementor = 4;
                for(i = 0; i < whitePegs; i++){
                    this.elements[indexIncrementor].style.backgroundColor = "#F0F8FF";
                    indexIncrementor++
                }
                for(i = 0; i < blackPegs; i++){
                    this.elements[indexIncrementor].style.backgroundColor = "black";
                    indexIncrementor++
                }
                this.interactable = false;
                
                if(whitePegs === 4){
                    victory(this.guessNumber);
                } else {
                    const nextGuessbox = guessBoxObjects[this.guessNumber];
                    nextGuessbox.interactable = true;
                }
            }
        }
        //static function to get the respective guessBox object based on the guess id
        static getGuessBox(inputId){
            if(inputId.includes("guess")){
                const targetGuessNumber = inputId.slice(5,6);
                const targetObject = guessBoxObjects.filter((x) => x.guessNumber === targetGuessNumber)[0];
                return targetObject;
            } else if(inputId.includes("submit")){
                const targetGuessNumber = inputId.slice(6,7);
                const targetObject = guessBoxObjects.filter((x) => x.guessNumber === targetGuessNumber)[0];
                return targetObject;
            }
        }
    }
    //create the array of guessBoxObjects
    for(i = 1; i < 10; i++){
        const generatedObject = new guessBox(i);
        guessBoxObjects.push(generatedObject);
    }

    guessBoxObjects.forEach((x) => {
        x.elements = getElements(x.guessNumber);
    })

    //selectedColor[0] is current selected color, will increment left / right using below function
    var selectedColor = ['blue','green','red','yellow','pink','orange'];
    function incrementSelectedColor(){
        const firstColor = selectedColor.shift();
        selectedColor.push(firstColor);
        return selectedColor[0];
    }

    function addPeg(targetId){
        const targetElement = document.getElementById(targetId);
        const guessNumber = targetId.slice(6,7);
        const guessIndex = (guessNumber - 1);
        const targetGuessBox = guessBox.getGuessBox(targetId);
        if (targetGuessBox.interactable){
            targetGuessBox.guesses[guessIndex] = selectedColor[0];
            targetGuessBox.elements[guessIndex].style.backgroundColor = selectedColor[0];
            incrementSelectedColor();
        }
    }

    function submitGuess(targetId){
        targetElement = document.getElementById(targetId);
        targetElement.checkGuess();
    }

    function userInteraction(event){
        const targetElement = event.target;
        if(targetElement.id.includes("submit")){
            guessBox.getGuessBox(targetElement.id).checkGuess()
        } else if(targetElement.id.includes("guess")){
            addPeg(targetElement.id);
        }
    }

    function startGame() {
        guessBoxObjects.forEach((x) => x.reset());
        guessBoxObjects[0].interactable = true;
    }

    function victory(guessNumber) {
        const targetGuessBox = guessBoxObjects[guessNumber - 1];
        targetGuessBox.elements[0].parentElement.style.backgroundColor = "green";
        targetGuessBox.elements[8].innerText = "play again";
        targetGuessBox.elements[8].addEventListener('click',startGame);
    }

    document.getElementById("mastermindGame").addEventListener('click',(event) => userInteraction(event));

    startGame();