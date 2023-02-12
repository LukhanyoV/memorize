const {createApp} = Vue

const app = {
	data() {
		return {
			appName: 'Memorize',
			rules: [
				'Memorize and replay the sequence to advance to next level',
				'Sequence has to replayed in the order you saw it in',
				'The number of square that make the sequence will increase'
			],
			currentLevel: 1,
			gameBoard: [],
			currentBoard: [],
			currentSequence: [],
			playerSequence: [],
			timer: null,
			isPlaying: false

		}
	},
	methods: {
		startGame() {
			this.isPlaying = true
			setTimeout(() => {
				this.playSequence()
			}, 2000)
		},
		randomSquare() {
			let rand = this.shuffle(this.gameBoard)
			while(rand === this.currentSequence[this.currentSequence.length-1]) rand = this.shuffle(this.gameBoard)
			this.currentSequence.push(rand)
			this.currentBoard = this.gameBoard.map((tile, index) => rand === index ? {...tile, color: 'green'} : {...tile})
		},
		playSequence() {
			this.timer = setInterval(() => {
				if(this.currentSequence.length >= this.currentLevel + 4){
					clearInterval(this.timer)
				} else {
					this.randomSquare()
				}
			}, 900);
		},
		shuffle(arr) {
			return !Array.isArray(arr) ? 0 : Math.floor(Math.random()*arr.length)
		},
		playerMove(id){
			this.playerSequence.push(id)
			this.currentBoard = this.gameBoard.map((tile, index) => id === index ? {...tile, color: 'green'} : {...tile})
		},
		verifySequences(computer, player){
			for(let i = 0; i < computer.length; i++){
				if(computer[i] !== player[i]) return false
			}
			return true
		},
		handleSubmit() {
			const results = this.verifySequences(this.currentSequence, this.playerSequence)
			alert(results)
		},
		clearPlayerSequence() {
			this.playerSequence = []
		}
	},
	mounted() {
		const board = new Array(9).fill({})
		this.gameBoard = board.map((tile, index) => {
			return {...tile, id: index}
		})
		this.currentBoard = this.gameBoard
	}
}

createApp(app).mount('#app')
