import {} from '/helpers/cangjieHelper.mjs'

customElements.define(
  'cangjie-input',
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <style>
          cangjie-input input {
            border: 0;
            border-radius: 4px;
            box-shadow: inset 0 2px 4px Grey;
            font-size: 2em;
            outline: 0;
            padding: 10px;
          }
        </style>
        <input type="text">
      `

      const input = this.querySelector('input')

      input.addEventListener('input', ({ target: { value } }) => {
        console.log(value)
      })
    }
  }
)
