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
        this.level = 0;

        for (let i=0; i<col; i++) {
            this.field[i] = [];
        }
        this.generateField();
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
    
    setObstacle() {

        for (let i=0; i<this.level * 10; i++) {
            const x = randomer.NUMBER.INTEGER(1, 10) - 1;
            const y = randomer.NUMBER.INTEGER(1, 10) - 1;
            this.field[x][y] = hole;
            // console.log("pos ", this.hatX, this.hatY);
        }
    }

    setHatLocation() {
        const x = randomer.NUMBER.INTEGER(1, 10) - 1;
        const y = randomer.NUMBER.INTEGER(1, 10) - 1;
        this.field[x][y] = hat;
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
        let answer = "";
        let gameEnd = false

        answer = this.askLevel();
        if (answer == 'Q')
            return; // user didn't choose level but choose Q

        this.setObstacle();
        this.setHatLocation();
        this.setPlayerLocation(this.playerX, this.playerY);
    
        while ( ! gameEnd ) {
            this.print();
            if ( ( answer = this.askQuestion() ) == 'Q') // get direction before checking if it is Q
                gameEnd = true;
            else if (! this.movePlayer(answer) ) {
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

    askLevel() {
        let ans = "";
        do {
            ans = prompt('Select difficulty level 1, 2 or 3 or Q to quit? ').toUpperCase();
        } while (ans != 'Q' && ans != '1' && ans != '2' && ans != '3');
        
        (ans == '1') ? this.level = 1 : (ans == '2') ? this.level = 2 : this.level = 3;
        
        console.log(this.level);
        return ans;
    }
} // end of class Field

const game = new Field();
game.runGame();