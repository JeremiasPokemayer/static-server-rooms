import { state } from "../state";
type Message = {
  from: string;
  message: string;
};
class ChatPage extends HTMLElement {
  connectedCallback() {
    state.suscribe(() => {
      const currentState = state.getState();
      this.messages = currentState.messages;
      this.render();
    });
    this.render();
    this.addListeners();
  }
  messages: Message[] = [];
  addListeners() {
    const form = this.querySelector(".submit-message") as any;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      state.pushMessage(e.target["new-message"].value);
    });
  }
  render() {
    this.innerHTML = `
              <custom-header></custom-header>
              <div class="container-chat">
                <h1 class="title-chat">Chat</h1>
                <p>room id: ${state.data.roomId}</p>
                <div class="messages">
                ${this.messages
                  .map((m) => {
                    const userClass =
                      m.from === "Jeremias" ? "user-message" : "other-message";
                    return `
                    <div class="container-${userClass}"> 
                      <div class="from-message">${m.from}</div>
                      <div class="message ${userClass}">${m.message}</div>
                    </div>`;
                  })
                  .join("")}    
                </div>
                <form class="submit-message">
                    <input type="text" name="new-message" class="input-chat">
                    <button class="button-enviar">Enviar</button>
                </form>
              </div>
          `;
    this.addListeners();
  }
}
customElements.define("chat-page", ChatPage);
