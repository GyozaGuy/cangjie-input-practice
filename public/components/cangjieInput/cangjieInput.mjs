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
          cangjie-input .cangjieInput_descContainer {
            margin-top: 20px;
            text-align: left;
          }
          cangjie-input .cangjieInput_descContainer:not([visible]) {
            visibility: hidden;
          }
          cangjie-input .cangjieInput_descContainer[visible] {
            visibility: visible;
          }
          cangjie-input .cangjieInput_definition {
            font-size: 1.5em;
            margin-top: 20px;
          }
        </style>

        <div class="cangjieInput_testCharacter"></div>

        <input type="text">

        <div class="cangjieInput_descContainer">
          <div>
            <strong>Cangjie:</strong> <span class="cangjieInput_cangjieCode"></span>
          </div>

          <div>
            <strong>Alpha:</strong> <span class="cangjieInput_alphaCode"></span>
          </div>

          <div>
            <strong>Simplified:</strong> <span class="cangjieInput_simpChar"></span>
          </div>

          <div>
            <strong>Pronunciation:</strong> <span class="cangjieInput_pronunciation"></span>
          </div>

          <div class="cangjieInput_definition"></div>
        </div>
      `

      this.testCharacterBox = this.querySelector('.cangjieInput_testCharacter')
      this.cangjieCodeBox = this.querySelector('.cangjieInput_cangjieCode')
      this.alphaCodeBox = this.querySelector('.cangjieInput_alphaCode')
      this.descContainer = this.querySelector('.cangjieInput_descContainer')
      this.simpCharBox = this.querySelector('.cangjieInput_simpChar')
      this.pronunciationBox = this.querySelector('.cangjieInput_pronunciation')
      this.definitionBox = this.querySelector('.cangjieInput_definition')

      const input = this.querySelector('input')

      input.addEventListener('keypress', async event => {
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
            this.descContainer.removeAttribute('visible')
            this.selectRandomTestCharacter()
          } else {
            const result = await testCangjieForCharacter(value, this.character)

            this.testCharacterBox.setAttribute(result ? 'correct' : 'incorrect', '')
            this.descContainer.setAttribute('visible', '')
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
      // TODO: select character lists
      const characterLists = await getCharacterLists()
      const { characters, codes, english, pinyin } = await getRandomCharacter(characterLists)
      const { simp, trad } = characters

      this.character = trad
      this.codes = codes
      this.simpChar = simp
      this.pronunciation = pinyin.join(', ')
      this.definition = english.join(', ')
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

    set definition(definition) {
      this.definitionBox.textContent = definition
    }

    set pronunciation(pronunciation) {
      this.pronunciationBox.textContent = pronunciation
    }

    set simpChar(character) {
      this.simpCharBox.textContent = character
    }
  }
)
