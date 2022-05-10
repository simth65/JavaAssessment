const prompt = require('prompt-sync')({sigint: true});
const clear = require('clear-screen');
 
const hat = '^';                // objective
const hole = 'O';               // hazzard
const fieldCharacter = '░';     // safe play flatform
const pathCharacter = '*';      // play character to move
const row = 10;     // horizontal grid field
const col = 10;     // vertical grid field

class Field {
    field = [];

    constructor() {
        this.X = 0;
        this.Y = 0;

        for (let i=0; i<col; i++) {
            this.field[i] = [];
        }
        this.generateField();
    }

    generateField() {
        for (let y=0; y<row ; y++) {
            for (let x = 0; x<col; x++) {
                const prob = Math.random();
                this.field[y][x] = fieldCharacter;
            }
        }
    }

    runGame() {
        this.print();
        this.askQuestion();
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

        } while (ans != 'Q');
    }
} // end of class Field

const game = new Field();
game.runGame();