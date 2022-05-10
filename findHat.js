const prompt = require('prompt-sync')({sigint: true});
const clear = require('clear-screen');
const randomer = require('complete-randomer');
 
const hat = '^';                // objective
const hole = 'O';               // hazzard
const fieldCharacter = '░';     // safe play flatform
const playerCharacter = '*';      // play character to move
const row = 10;     // horizontal grid field
const col = 10;     // vertical grid field

class Field {
    field = [];

    constructor() {
        this.playerX = 0; // location of play character
        this.playerY = 0; // location of play character

        this.hatX = 0;
        this.hatY = 0;

        for (let i=0; i<col; i++) {
            this.field[i] = [];
        }
        this.generateField();
        this.setHatLocation();
        this.setPlayerLocation(this.playerX, this.playerY);
    }

    generateField() {
        for (let y=0; y<row ; y++) {
            for (let x = 0; x<col; x++) {
                const prob = Math.random();
                // if (randomer.BOOLEAN.IS())
                //     this.field[y][x] = hole;
                // else            
                    this.field[y][x] = fieldCharacter;
            }
        }
    }
    
    setHatLocation() {
        this.hatX = randomer.NUMBER.INTEGER(1, 10) - 1;
        this.hatY = randomer.NUMBER.INTEGER(1, 10) - 1;
        this.field[this.hatX][this.hatY] = hat;
        // console.log("pos ", this.hatX, this.hatY);
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
        if ( (this.playerX < 0 || this.playerX > 9) || this.playerY < 0 || this.playerY > 9) {
            console.log("Out of bounds - Game End!");
            return false;
        }
        else if ( this.field[this.playerX][this.playerY] == hole ) {
            console.log("Sorry, you fell down a hole!");
            return false;
        } else if ( this.field[this.playerX][this.playerY] == hat )
        {
            console.log("Congrats, you found your hat!");
            return false; // hat found, game will end
        }
        this.setPlayerLocation(this.playerX, this.playerY);
        return true;
    }

    runGame() {
        let direction = "";
        let gameEnd = false
        while ( ! gameEnd ) {
            this.print();
            if ( ( direction = this.askQuestion() ) == 'Q') // get direction before checking if it is Q
                gameEnd = true;
            else if (! this.movePlayer(direction) ) {
                // invalid move made by user aborts game
                // or hit obsticle
                // or found hat
                gameEnd = true;
            }
        } 

    }

    print() {
        clear();
        const displayString = this.field.map( row => {
            return row.join('');
        }).join('\n');
        console.log(displayString);
    }

    askQuestion() {
        let ans = "";
        do {
            ans = prompt('Which way? ').toUpperCase();
        } while (ans != 'Q' && ans != 'U' && ans != 'D' && ans != 'L' && ans != 'R');
        return ans;
    }
} // end of class Field

const game = new Field();
game.runGame();