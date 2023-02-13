const {createApp} = Vue

const app = {
	data() {
		return {
			appName: 'Memorize',
			rules: [
				'Memorize and replay the sequence to advance to next level',
				'Sequence has to replayed in the order you saw it in',
				'The number of square that make the sequence are equal to the level number',
				'Clear button can be pressed when you make a mistake while capturing your sequence',
				'Quit button will end the game if you want to quit'
			],
			currentLevel: 1,
			gameBoard: [],
			currentBoard: [],
			currentSequence: [],
			playerSequence: [],
			timer: null,
			countUp: null,
			countUpKeep: 0,
			isPlaying: false,
			autoSubmit: true,
			feedback: {},
			playerLives: 3,
			gameEnd: false

		}
	},
	methods: {
		startGame() {
			this.isPlaying = true
			setTimeout(() => {
				this.playSequence()
				this.countUp = setInterval(() => this.countUpKeep++, 1000)
			}, 1000)
		},
		randomSquare() {
			let rand = this.shuffle(this.gameBoard)
			while(rand === this.currentSequence[this.currentSequence.length-1]) rand = this.shuffle(this.gameBoard)
			this.currentSequence.push(rand)
			this.currentBoard = this.gameBoard.map((tile, index) => rand === index ? {...tile, color: 'green'} : {...tile})
		},
		playSequence() {
			this.feedback = {}
			this.timer = setInterval(() => {
				if(this.currentSequence.length >= this.currentLevel){
					clearInterval(this.timer)
					this.clearBoard()
				} else {
					this.randomSquare()
				}
			}, 900);
		},
		shuffle(arr) {
			return !Array.isArray(arr) ? 0 : Math.floor(Math.random()*arr.length)
		},
		playerMove(id){
			if(this.currentSequence.length <= this.playerSequence.length) return
			this.playerSequence.push(id)
			this.currentBoard = this.gameBoard.map((tile, index) => id === index ? {...tile, color: 'green'} : {...tile})
			if(this.currentSequence.length === this.playerSequence.length && this.autoSubmit){
				setTimeout(this.handleSubmit, 500)
			}
		},
		verifySequences(computer, player){
			for(let i = 0; i < computer.length; i++){
				if(computer[i] !== player[i]) return false
			}
			return true
		},
		handleSubmit() {
			const results = this.verifySequences(this.currentSequence, this.playerSequence)
			if(results) {
				this.feedback = {msg: 'Yay! Now loading next level :)', color: 'text-green'}
				this.clearBoard()
				this.currentLevel++
				if(this.currentLevel % 10 === 0) this.playerLives++
			} else {
				this.playerLives--
				this.feedback = {msg: 'Nay! You lost a life, please try again :(', color: 'text-red'}
				this.clearPlayerSequence()
			}
			this.currentSequence = []
			this.playerSequence = []
			setTimeout(() => {
				this.playSequence()
				this.feedback
			}, 1500)
		},
		clearPlayerSequence() {
			this.playerSequence = []
			this.clearBoard()
		},
		clearBoard() {
			this.currentBoard = this.gameBoard
			if(this.playerLives <= 0){
				this.gameOver()
			}
		},
		gameOver() {
			clearInterval(this.countUp)
			this.isPlaying = false
			this.gameEnd = true
		},
		newGame() {
			this.isPlaying = false
			this.gameEnd = false
			this.currentSequence = []
			this.playerSequence = []
			this.feedback = {}
			this.playerLives = 3
			this.currentLevel = 1
			this.currentBoard = this.gameBoard
			this.timer = null
			this.countUpKeep = 0
			this.countUp = null
		}
	},
	mounted() {
		const board = new Array(9).fill({})
		this.gameBoard = board.map((tile, index) => {
			return {...tile, id: index}
		})
		this.clearBoard()
	},
	computed: {
		gameTime() {
			var distance = this.countUpKeep
			var days = Math.floor(distance / (60 * 60 * 24));
			var hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
			var minutes = Math.floor((distance % (60 * 60)) / (60));
			var seconds = Math.floor((distance % (60)));
			if(days > 0){
				return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`
			} else if(hours > 0){
				return `${hours} hours ${minutes} minutes ${seconds} seconds`
			} else if(minutes > 0){
				return `${minutes} minutes ${seconds} seconds`
			} else {
				return `${seconds} seconds`
			}
		}
	}
}

createApp(app).mount('#app')
