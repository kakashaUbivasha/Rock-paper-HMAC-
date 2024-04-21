const crypto = require('crypto');
const AsciiTable = require('ascii-table');

class Game {
    constructor(moves) {
        this.moves = moves;
        this.key = this.generateKey();
        this.computerMove = this.moves[Math.floor(Math.random() * this.moves.length)];
        this.hmac = this.calculateHmac(this.computerMove, this.key);
    }

    generateKey() {
        return crypto.randomBytes(32).toString('hex');
    }

    calculateHmac(move, key) {
        return crypto.createHmac('sha256', key).update(move).digest('hex');
    }
    menu(){
        console.log("Available moves:");
        this.moves.forEach((move, index) => {
            console.log(`${index + 1} - ${move}`);
        });
        console.log(`${this.moves.length+1} - Help`)
        console.log("0 - Exit");
        console.log('Enter your move: ')
    }
    play() {
        console.log("HMAC:", this.hmac);
        this.menu()
        process.stdin.on('data', (data) => {
            const userChoice = parseInt(data.toString().trim());
            if (userChoice === 0) {
                console.log("Goodbye!");
                process.exit();
            }
            else if(userChoice === this.moves.length+1){
                console.log(table)
            }
            else if (userChoice < 1 || userChoice > this.moves.length || isNaN(userChoice)) {
                console.log("Invalid choice. Please enter a number between 1 and", this.moves.length+1, 'or 0');
                this.menu()
            } else {
                const userMove = this.moves[userChoice - 1];
                console.log("Your move:", userMove);
                console.log("Computer's move:", this.computerMove);
                const result = this.getResult(userChoice);
                console.log("Result:", result);
                console.log("HMAC key:", this.key);
                console.log(`HMAC-SHA256 Online Generator Tool https://www.devglan.com/online-tools/hmac-sha256-online`)
                process.exit();
            }
        });
    }
    getResult(userChoice) {
        const numMoves = this.moves.length;
        const computerIndex = this.moves.indexOf(this.computerMove);
        const userIndex = this.moves.indexOf(this.moves[userChoice - 1]);
        const result = Math.sign((userIndex - computerIndex + Math.floor(numMoves / 2) + numMoves) % numMoves - Math.floor(numMoves / 2));

        if (result === 0) {
            return "Draw";
        } else if (result === 1) {
            return "Win";
        } else {
            return "Lose";
        }
    }

}
function generateTable(moves) {
    const table = new AsciiTable();
    table.setHeading("v PC\\User >", ...moves);
    for (let i = 0; i < moves.length; i++) {
        const row = [];
        row.push(moves[i]);
        for (let j = 0; j < moves.length; j++) {
            const result = Math.sign((j - i + moves.length + Math.floor(moves.length / 2)) % moves.length - Math.floor(moves.length / 2));
            let resultText = "";
            if (result === 0) {
                resultText = "Draw";
            } else if (result === 1) {
                resultText = "Win";
            } else {
                resultText = "Lose";
            }
            row.push(resultText);
        }
        table.addRow(row);
    }

    return table.toString();
}

const args = process.argv.slice(2);
if (args.length < 3 || args.length % 2 === 0 || new Set(args).size !== args.length) {
    console.log("Invalid arguments. Please provide an odd number of unique moves (>= 3). For example: rock, scissors, paper");
    process.exit();
}

const game = new Game(args);
const table = generateTable(args);
game.play();
