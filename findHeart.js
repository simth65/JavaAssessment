// instead of finding hat, i have changed the code to finding heart ❤
// the player have also been changed to ☺ (smiley face)


const prompt = require('prompt-sync')({sigint: true});
const clear = require('clear-screen');
const randomer = require('complete-randomer');
const { table } = require('table');
 
const heart = '❤'; // '^';                // objective
const hole = 'O';               // hazzard
const fieldCharacter = '░';     //' ';     // safe play flatform
const playerCharacter = '☺'; // '*';      // play character to move

class Field {
    field = [];

    constructor() {
        this.playerX = 0; // location of play character
        this.playerY = 0; // location of play character
        this.difficultyLevel = 0;
        this.row = 0;     // horizontal grid field change row values to use different grid size
        this.col = 0;     // vertical grid field change col values to use different grid size
    }

    initField() {
        for (let i=0; i<this.row; i++) {
            this.field[i] = []; // create rows first
        }
        this.generateField();
        
        // setPlayerLocation must run before setheartLocation & setObstacle otherwise heart or hole may be placed on 0/0 location
        this.setPlayerLocation(this.playerX, this.playerY); // will be interesting to start player at a random location instead of 0/0, but following specification
        this.setHeartLocation();
        this.setObstacle();
    }

    generateField() {
        for (let x=0; x<this.row ; x++) {
            for (let y = 0; y<this.col; y++) { // create the columns of each row
                // const prob = Math.random();
                // if (randomer.BOOLEAN.IS()) // 50/50 chance for a field location to be a hole, percentage is too high
                //     this.field[x][y] = hole;
                // else            
                this.field[x][y] = fieldCharacter; // paint the whole field first
            }
        }
    }
    
    setObstacle() {

        // level of difficulty, 1 = 10% hole, 2 = 20%, 3 = 30% or 4 = 40% of total grid size
        // increasing level of difficulty also has a higher chance of not having a path to heart area.
        const obstacleNumber = (this.row * this.col) * (this.difficultyLevel /10);
        for (let i=0; i<obstacleNumber; i++) {
            let x = 0, y = 0;
            do {
                x = randomer.NUMBER.INTEGER(1, this.row) - 1;
                y = randomer.NUMBER.INTEGER(1, this.col) - 1;
            } // randomly place HOLE on the field, avoid placing on the same place or over a heart or PLAYERCHARACTER position
            while (this.field[x][y] !== fieldCharacter); // optimized
            //while (this.field[x][y] == heart || this.field[x][y] == playerCharacter || this.field[x][y] == hole);

            this.field[x][y] = hole;
            // console.log("pos ", this.heartX, this.heartY);
        }
    }

    setHeartLocation() {
        let x = 0, y = 0;
        do {
            // loop until a fieldCharacter location is found for heart to be placed            
            x = randomer.NUMBER.INTEGER(1, this.row) - 1;
            y = randomer.NUMBER.INTEGER(1, this.col) - 1;
        }
        while (this.field[x][y] !== fieldCharacter); 
        this.field[x][y] = heart;
        
        // console.log("heart pos ", x, y);
    }

    setPlayerLocation(x, y) {
        this.field[x][y] = playerCharacter;
        // console.log("player ", x, y);
    }

    restorePreviousField(x, y) {
        // this is to restore the previous field before moving player to the new location
        this.field[x][y] = fieldCharacter;
    }

    movePlayer(direction) {
        this.restorePreviousField(this.playerX, this.playerY);
        switch (direction) {
            case 'U':
                this.playerX--;
                break;
            case 'D':
                this.playerX++;
                break;
            case 'L':
                this.playerY--;
                break;
            case 'R':
                this.playerY++;
                break;
        }
        if ( (this.playerX < 0 || this.playerX > (this.row-1) ) || this.playerY < 0 || this.playerY > (this.col-1) ) {
            console.log("Out of bounds - Game End!");
            return false;
        }
        else if ( this.field[this.playerX][this.playerY] == hole ) {
            console.log("Sorry, you fell down a hole!");
            return false;
        } else if ( this.field[this.playerX][this.playerY] == heart )
        {
            console.log("Congrats, you found your heart!");
            return false; // heart found, game will end
        }
        this.setPlayerLocation(this.playerX, this.playerY);
        return true;
    }

    print() {
        clear(); // clear screen before showing changes

        // the following code was tested to be working
        // const displayString = this.field.map( row => {
        //     return row.join('');
        // }).join('\n');
        // console.log(displayString);

        console.log(table(this.field));
    }

    askQuestion() {
        let ans = "";
        do {
            ans = prompt('Which way do you want to go -> u-up, d-down, l-left, r-right or q-quit? ').toUpperCase();
        } while (ans != 'Q' && ans != 'U' && ans != 'D' && ans != 'L' && ans != 'R');
        return ans;
    }

    askDifficultyLevel() {
        let ans = "";
        do {
            // prompt for level of difficulty, 1 = 10% hole, 2 = 20%, 3 = 30% or 4 = 40%
            // increasing level of difficulty also has a higher chance of not having a path to heart area.
            ans = prompt('Select difficulty level 1, 2 or 3 or 4 or q to quit? ').toUpperCase();
        } while (ans != 'Q' && ans != '1' && ans != '2' && ans != '3' && ans != '4');
        
        // not testing for 'Q' here as this will quit the program when this routine exits
        (ans == '1') ? this.difficultyLevel = 1 : (ans == '2') ? this.difficultyLevel = 2 : (ans == '3') ? this.difficultyLevel = 3 : this.difficultyLevel = 4;
        
        return ans;
    }

    askGridSize() {
        let ans = "";
        do {
            ans = prompt('Select a Grid size, 1 for 10x10, 2 for 13x13, 3 for 20x20 or q to quit? ').toUpperCase();
        } while (ans != 'Q' && ans != '1' && ans != '2' && ans != '3');
        switch (ans) { // set desired grid size, not testing for 'Q' as this will quit the program
            case '1':
                this.row = 10;
                this.col = 10;
                break;
            case '2':
                this.row = 13;
                this.col = 13;
                break;
            case '3':
                this.row = 20;
                this.col = 20;
                break;
        }       
        return ans;
    }

    runGame() {
        let answer = "";
        let gameEnd = false;

        console.log("Welcome to Find Heart game....");
        console.log("The objective is to move ☺ towards ❤ (heart) and avoid falling into any O (Hole) or moving out of the Grid box.")
        
        answer = this.askGridSize(); // get grid size
        if (answer == 'Q') {
            console.log("You quit this game! Come back again soon.");
            return; // user didn't choose grid size but choose Q
        }

        answer = this.askDifficultyLevel(); // get difficulty level
        if (answer == 'Q') {
            console.log("You quit this game! Come back again soon.");
            return; // user didn't choose level but choose Q
        }

        this.initField(); // initialise game field
    
        while ( ! gameEnd ) {
            this.print();
            if ( ( answer = this.askQuestion() ) == 'Q') {// get direction before checking if it is Q
                console.log("You quit this game! Come back again soon.");
                gameEnd = true;
            }
            else if (! this.movePlayer(answer) ) {
                // invalid move made by user aborts game
                // or hit obsticle
                // or found heart
                gameEnd = true;
            }
        } 

    }
} // end of class Field

const game = new Field();
game.runGame();