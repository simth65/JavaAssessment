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
const row = 13;     // horizontal grid field change row values to use different grid size
const col = 13;     // vertical grid field change col values to use different grid size

class Field {
    field = [];

    constructor() {
        this.playerX = 0; // location of play character
        this.playerY = 0; // location of play character
        this.level = 0;

        for (let i=0; i<row; i++) {
            this.field[i] = []; // create rows first
        }
        this.generateField();
        this.setheartLocation();
        this.setPlayerLocation(this.playerX, this.playerY); // will be interesting to start player at a random location instead of 0/0, but following specification
    }

    generateField() {
        for (let x=0; x<row ; x++) {
            for (let y = 0; y<col; y++) { // create the columns of each row
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
        const obstacleNumber = (row * col) * (this.level /10);
        for (let i=0; i<obstacleNumber; i++) {
            let x = 0, y = 0;
            do {
                x = randomer.NUMBER.INTEGER(1, row) - 1;
                y = randomer.NUMBER.INTEGER(1, col) - 1;
            } // randomly place HOLE on the field, avoid placing on the same place or over a heart or PLAYERCHARACTER position
            while (this.field[x][y] != fieldCharacter); // optimized
            //while (this.field[x][y] == heart || this.field[x][y] == playerCharacter || this.field[x][y] == hole);

            this.field[x][y] = hole;
            // console.log("pos ", this.heartX, this.heartY);
        }
    }

    setheartLocation() {
        const x = randomer.NUMBER.INTEGER(1, row) - 1;
        const y = randomer.NUMBER.INTEGER(1, col) - 1;
        this.field[x][y] = heart;
        // console.log("pos ", this.heartX, this.heartY);
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
        if ( (this.playerX < 0 || this.playerX > (row-1) ) || this.playerY < 0 || this.playerY > (col-1) ) {
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
        clear();
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
            ans = prompt('Which way (u-up, d-down, l-left or r-right)? ').toUpperCase();
        } while (ans != 'Q' && ans != 'U' && ans != 'D' && ans != 'L' && ans != 'R');
        return ans;
    }

    askLevel() {
        let ans = "";
        do {
            // prompt for level of difficulty, 1 = 10% hole, 2 = 20%, 3 = 30% or 4 = 40%
            // increasing level of difficulty also has a higher chance of not having a path to heart area.
            ans = prompt('Select difficulty level 1, 2 or 3 or 4 or Q to quit? ').toUpperCase();
        } while (ans != 'Q' && ans != '1' && ans != '2' && ans != '3' && ans != '4');
        
        (ans == '1') ? this.level = 1 : (ans == '2') ? this.level = 2 : (ans == '3') ? this.level = 3 : this.level = 4;
        
        //console.log(this.level);
        return ans;
    }

    runGame() {
        let answer = "";
        let gameEnd = false;

        console.log("Welcome to this Find Heart game.");
        console.log("The objective is to move ☺ towards ❤  and avoid colliding into any O or moving out of the Grid box.")
        answer = this.askLevel();
        if (answer == 'Q') {
            console.log("You quit this game! Come back again soon.");
            return; // user didn't choose level but choose Q
        }

        this.setObstacle();
    
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