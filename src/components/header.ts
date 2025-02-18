export function init() {
  class Header extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      var shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const style = document.createElement("style");
      div.classList.add("header");

      style.innerHTML = `
        .header{
            background-color:rgba(255, 130, 130, 1);
            width:100%;
            height:60px;
            margin:0;
        }
      `;
      div.appendChild(style);
      shadow.appendChild(div);
    }
  }
  customElements.define("custom-header", Header);
}
