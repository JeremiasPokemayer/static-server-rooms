import { Router } from "@vaadin/router";
import { state } from "../state";

class Home extends HTMLElement {
  connectedCallback() {
    this.render();

    const form = this.querySelector(".form") as any;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const selectRoom = target["select-room"].value;

      if (selectRoom === "nuevo") {
        state.init();
        state.setEmailAndFullname(target.email.value, target.nombre.value);
        state.singIn((err) => {
          if (err) console.error("hubo un error en el signIn");

          state.askNewRoom(() => {
            state.accessToRoom();
          });
        });
      } else {
        const roomId = target["room-id"].value;
        state.data.roomId = roomId;
      }

      Router.go("/chat");
    });
  }
  render() {
    this.innerHTML = `
            <custom-header></custom-header>
            <h1 class="title-home">Bienvenido/a</h1>
            <form class="form">
              <div class="div-form">
                <label>email</label>
                <input type="text" name="email" class="input-home">
              </div>
              <div class="div-form">
                <label >Tu nombre</label>
                <input type="text" name="nombre" class="input-home">
              </div>
              <div class="div-form">
                <label>room</label>
                <select name="select-room" class="input-select">
                  <option value="nuevo">Nuevo room</option>
                  <option class="option__room-existente" value="existente">Room existente</option>
                </select>
              </div>
              <div class="div-form-hide">
                <label>Room Id</label>
                <input type="text" name="room-id" class="input-home">
              </div>
              <button class="button-comenzar">Comenzar</button>
            </form>
        `;
    const containerHide = this.querySelector(".div-form-hide") as any;
    const selectRoom = this.querySelector("select[name='select-room']") as any;

    selectRoom?.addEventListener("change", () => {
      if (selectRoom.value === "existente") {
        containerHide.style.display = "block";
      } else {
        containerHide.style.display = "none";
      }
    });
  }
}
customElements.define("home-page", Home);
