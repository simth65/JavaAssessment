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
const row = 13;     // horizontal grid field
const col = 13;     // vertical grid field

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
        this.setPlayerLocation(this.playerX, this.playerY);
    }

    generateField() {
        for (let y=0; y<row ; y++) {
            for (let x = 0; x<col; x++) { // create the columns of each row
                // const prob = Math.random();
                // if (randomer.BOOLEAN.IS())
                //     this.field[y][x] = hole;
                // else            
                    this.field[y][x] = fieldCharacter; // paint the whole field first
            }
        }
    }
    
    setObstacle() {

        // level of difficulty, 1 = 10% hole, 2 = 20%, 3 = 30% or 4 = 40% of total grid size
        // increasing level of difficulty also has a higher chance of not having a path to heart area.
        
        for (let i=0; i<( (row * col) * (this.level /10) ); i++) {
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
            ans = prompt('Which way? ').toUpperCase();
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

        answer = this.askLevel();
        if (answer == 'Q')
            return; // user didn't choose level but choose Q

        this.setObstacle();
    
        while ( ! gameEnd ) {
            this.print();
            if ( ( answer = this.askQuestion() ) == 'Q') {// get direction before checking if it is Q
                console.log("You quit this game!");
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