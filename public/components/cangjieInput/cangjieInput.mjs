import {
  getCharacterLists,
  getCharactersForCode,
  getRandomCharacter,
  testCangjieForCharacter
} from '/helpers/cangjieHelper.mjs'

customElements.define(
  'cangjie-input',
  class extends HTMLElement {
    async connectedCallback() {
      this.innerHTML = `
        <style>
          cangjie-input .cangjieInput_testCharacter {
            align-items: center;
            display: flex;
            font-size: 10em;
            height: 300px;
            justify-content: space-around;
            text-shadow: 0 2px 4px Grey;
          }
          cangjie-input .cangjieInput_testCharacter[correct] {
            color: Green;
          }
          cangjie-input .cangjieInput_testCharacter[incorrect] {
            color: Red;
          }
          cangjie-input input {
            border: 0;
            border-radius: 4px;
            box-shadow: inset 0 2px 4px Grey;
            font-size: 2em;
            outline: 0;
            padding: 10px;
            width: 100%;
          }
          cangjie-input .cangjieInput_codeContainer {
            height: 30px;
          }
          cangjie-input .cangjieInput_codeContainer:not([visible]) {
            visibility: hidden;
          }
          cangjie-input .cangjieInput_codeContainer[visible] {
            align-items: center;
            display: flex;
            justify-content: space-between;
            visibility: visible;
          }
        </style>

        <div class="cangjieInput_testCharacter"></div>

        <input type="text">

        <div class="cangjieInput_codeContainer">
          <div>
            Cangjie: <strong class="cangjieInput_cangjieCode"></strong>
          </div>
          <div>
            Alpha: <strong class="cangjieInput_alphaCode"></strong>
          </div>
        </div>
      `

      this.testCharacterBox = this.querySelector('.cangjieInput_testCharacter')
      this.codeContainer = this.querySelector('.cangjieInput_codeContainer')
      this.cangjieCodeBox = this.querySelector('.cangjieInput_cangjieCode')
      this.alphaCodeBox = this.querySelector('.cangjieInput_alphaCode')
      const input = this.querySelector('input')

      input.addEventListener('keyup', async event => {
        const {
          code,
          target: { value }
        } = event

        if (code === 'Enter') {
          event.preventDefault()

          if (
            this.testCharacterBox.hasAttribute('correct') ||
            this.testCharacterBox.hasAttribute('incorrect')
          ) {
            this.testCharacterBox.removeAttribute('correct')
            this.testCharacterBox.removeAttribute('incorrect')
            input.value = ''
            this.codeContainer.removeAttribute('visible')
            this.selectRandomTestCharacter()
          } else {
            const result = await testCangjieForCharacter(value, this.character)

            this.testCharacterBox.setAttribute(result ? 'correct' : 'incorrect', '')
            this.codeContainer.setAttribute('visible', '')
          }
        }
      })

      input.addEventListener('input', async ({ target: { value } }) => {
        const { cangjie } = await getCharactersForCode(value)
        input.value = cangjie
      })

      this.selectRandomTestCharacter()
    }

    async selectRandomTestCharacter() {
      const characterLists = await getCharacterLists()
      // TODO: select character lists
      const { character, codes } = await getRandomCharacter(characterLists)

      this.character = character
      this.codes = codes
    }

    get character() {
      return this.testCharacterBox.textContent
    }

    set character(character) {
      this.testCharacterBox.textContent = character
    }

    set codes({ alpha, cangjie }) {
      this.cangjieCodeBox.textContent = cangjie
      this.alphaCodeBox.textContent = alpha
    }
  }
)
