<template>
  <div class="lista">
    <div v-if="!mostrar">
      <div class="w-50 mx-auto">
        <b-form-input
          v-model="usuario"
          type="text"
          placeholder="Introduce tu nombre de usuario"
          @keyup.native.enter="comprobarUsuario()"
        ></b-form-input>
        <file-pond
          name="test"
          ref="pond"
          label-idle="Drop files here..."
          allow-revert="false"
          allow-multiple="false"
          accepted-file-types="image/jpeg, image/png"
          server="http://127.0.0.1:3000/upload"
          v-bind:files="myFiles"
          v-on:init="handleFilePondInit"
        />
        <br>
      </div>
    </div>
    <div v-if="mostrar">
      <div class="w-50 mx-auto">
        <b-form-input
          v-model="nuevatarea"
          type="text"
          placeholder="¿Qué quieres recordar?"
          @keyup.native.enter="annadirTarea()"
        ></b-form-input>
        <file-pond
          name="test"
          ref="pond"
          label-idle="Drop files here..."
          allow-revert="false"
          allow-multiple="true"
          server="http://127.0.0.1:3000/upload"
          myFiles="files"
          v-on:init="handleFilePondInit"
        />
      </div>
      <hr>
      <p>
        <font-awesome-icon icon="chart-bar"/>
        {{porCompletar}} tareas pendientes de un total de {{ordenTareas.length}} |
        <font-awesome-icon icon="times" style="color: orange;"/>
        <a style="color:orange; cursor: pointer;" @click="borrarTodas()">Borrar tareas completada</a>
      </p>
      <hr>
      <div
        class="w-50 mx-auto"
        style="border: 2px solid #878080; background-color:#303030; border-radius: 5px;"
      >
        <div
          class="animated fadeIn"
          v-for="(item, index) in filteredItems"
          :key="index"
          style="border-top: 1px solid #878080;"
        >
          <b-container class="p-1">
            <b-row align-v="center">
              <b-col cols="1">
                <b-button variant="basic" v-if="item.Completada" @click="completar(index, false)">
                  <font-awesome-icon
                    :icon="['far', 'check-circle']"
                    size="lg"
                    style="color:#00897b;"
                  />
                </b-button>
                <b-button variant="basic" v-else @click="completar(index, true)">
                  <font-awesome-icon :icon="['far', 'circle']" size="lg" style="color:white;"/>
                </b-button>
              </b-col>
              <b-col cols="9" style="text-align:left;">
                <h2 v-if="item.Completada" style="color:#00897b;">
                  <Strike>{{item.Tarea}}</Strike>
                </h2>
                <h2 v-else>{{item.Tarea}}</h2>
              </b-col>
              <b-col cols="1">
                <b-button variant="danger" @click="borrar(index)">
                  <font-awesome-icon icon="minus-circle"/>
                </b-button>
              </b-col>
            </b-row>
            <b-row align-v="center">
              <b-col cols="2">
                <h6>Prioridad:</h6>
              </b-col>
              <div v-if="item.Prioridad == '3Baja'">
                <b-col>
                  <b-button-group size="sm">
                    <b-button variant="info">
                      <font-awesome-icon icon="angle-down"/>Low
                    </b-button>
                    <b-button variant="secondary" @click="cambiarPrioridad(index,'2Media')">Normal</b-button>
                    <b-button variant="secondary" @click="cambiarPrioridad(index,'1Alta')">High
                      <font-awesome-icon icon="angle-up"/>
                    </b-button>
                  </b-button-group>
                </b-col>
              </div>
              <div v-if="item.Prioridad == '2Media'">
                <b-col>
                  <b-button-group size="sm">
                    <b-button variant="secondary" @click="cambiarPrioridad(index,'3Baja')">
                      <font-awesome-icon icon="angle-down"/>Low
                    </b-button>
                    <b-button variant="primary">Normal</b-button>
                    <b-button variant="secondary" @click="cambiarPrioridad(index,'1Alta')">High
                      <font-awesome-icon icon="angle-up"/>
                    </b-button>
                  </b-button-group>
                </b-col>
              </div>
              <div v-if="item.Prioridad == '1Alta'">
                <b-col>
                  <b-button-group size="sm">
                    <b-button variant="secondary" @click="cambiarPrioridad(index,'3Baja')">
                      <font-awesome-icon icon="angle-down"/>Low
                    </b-button>
                    <b-button variant="secondary" @click="cambiarPrioridad(index,'2Media')">Normal</b-button>
                    <b-button variant="danger">High
                      <font-awesome-icon icon="angle-up"/>
                    </b-button>
                  </b-button-group>
                </b-col>
              </div>
              <b-col>
                <font-awesome-icon :icon="['far', 'clock']"/>
                Añadido hace {{ item.Fecha_Creacion | moment("from","now",true) }}
              </b-col>
              <b-col>
                <font-awesome-icon icon="user"/>
                Creado por: {{item.Usuario}}
              </b-col>
            </b-row>
            <b-row>
              <div
                v-for="(archivos, index) in myFiles"
                :key="index"
                style="border-top: 1px solid #878080;"
              >
                <h1>{{archivos}}</h1>
              </div>
            </b-row>
          </b-container>
        </div>
      </div>
      <hr>
    </div>
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="false"
      :showFile="false"
      :showTypingIndicator="showTypingIndicator"
      :colors="dark"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling"
    />
  </div>
</template>

<script>
// Import Vue FilePond
import vueFilePond from "vue-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import image preview plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

export default {
  name: "Lista",
  data: function() {
    return {
      nuevatarea: "",
      tareas: [],
      usuario: "",
      mostrar: false,
      myFiles: [],

      participants: [], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl:
        "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png",
      messageList: [], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: false,
      showTypingIndicator: "", // when set to a value matching the participant.id it shows the typing indicator for the specific user
      dark: {
        header: {
          bg: "#34495e",
          text: "#ecf0f1"
        },
        launcher: {
          bg: "#34495e"
        },
        messageList: {
          bg: "#2c3e50"
        },
        sentMessage: {
          bg: "#7f8c8d",
          text: "#ecf0f1"
        },
        receivedMessage: {
          bg: "#95a5a6",
          text: "#ecf0f1"
        },
        userInput: {
          bg: "#34495e",
          text: "#ecf0f1"
        }
      },
      alwaysScrollToBottom: true,
      messageStyling: true
    };
  },
  sockets: {
    test(testeo){
      console.log(testeo);
    },
    usuario(usuarioServer) {
      this.$notify({
        group: "foo",
        type: "success",
        title: "Usuario Conectado",
        text: "Saludad a " + usuarioServer + " que se acaba de conectar"
      });
      this.mostrar = true;
    },
    participantes(participantes) {
      this.participants = JSON.parse(participantes);
    },
    mensajesChat(mensajesServer) {
      this.messageList.push(mensajesServer);
    },
    errorLogin() {
      this.$notify({
        group: "foo",
        type: "error",
        title: "Usuario Conectado",
        text: "El nombre de usuario no está disponible"
      });
    },
    tarea(tareasServer) {
      this.tareas = tareasServer;
    },
    nuevaTarea(nuevaTareaServer) {
      this.$notify({
        group: "foo",
        type: "success",
        title: "Nota creada",
        text:
          nuevaTareaServer.Usuario +
          ' ha creado la nota "' +
          nuevaTareaServer.Tarea +
          '"'
      });
    },
    borrar(borrarTareaServer) {
      this.$notify({
        group: "foo",
        type: "error",
        title: "Nota creada",
        text: 'Se ha eliminado la tarea "' + borrarTareaServer.Tarea + '"'
      });
    },
    desconexion(usuarioDesconectadoServer) {
      this.$notify({
        group: "foo",
        type: "warn",
        title: "Usuario Desconectado",
        text: usuarioDesconectadoServer + " se ha desconectado"
      });
    }
  },
  methods: {
    annadirTarea: function() {
      if (this.nuevatarea != "") {
        this.tareas.push({
          Tarea: this.nuevatarea,
          Prioridad: "3Baja",
          Fecha_Creacion: new Date(),
          Completada: false,
          Usuario: this.usuario,
          Archivos: this.myFiles
        });

        this.$socket.emit("nuevaTarea", {
          Tarea: this.nuevatarea,
          Prioridad: "3Baja",
          Fecha_Creacion: new Date(),
          Completada: false,
          Usuario: this.usuario,
          Archivos: this.myFiles
        });
        this.nuevatarea = "";
      }
    },
    completar: function(index, valor) {
      this.filteredItems[index].Completada = valor;
      this.$socket.emit("tarea", this.tareas);
    },
    borrar: function(index) {
      var indice = this.tareas.indexOf(this.filteredItems[index]);
      this.$socket.emit("borrar", indice);
      this.$delete(this.tareas, indice);
      if (this.filteredItems.length == 0) {
        this.nuevatarea = "";
      }
    },
    cambiarPrioridad: function(index, prioridad) {
      this.filteredItems[index].Prioridad = prioridad;
      this.$socket.emit("tarea", this.tareas);
    },
    borrarTodas: function() {
      this.tareas = this.filteredItems.filter(function(index) {
        return index.Completada == false;
      });
      this.$socket.emit("tarea", this.tareas);
    },
    handleFilePondInit: function() {
      console.log("FilePond has initialized");

      // FilePond instance methods are available on `this.$refs.pond`
    },
    comprobarUsuario() {
      if (this.usuario != "") {
        this.$socket.emit("usuario", this.usuario);
      }
    },

    // Parte del chat
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen
          ? this.newMessagesCount
          : this.newMessagesCount + 1;
        this.onMessageWasSent({
          author: "me",
          type: "text",
          data: { text }
        });
      }
    },
    onMessageWasSent(message) {
      console.log(message);
      this.messageList.push(message);
      this.$socket.emit("mensajeChat", {
        author: this.usuario,
        type: "text",
        data: message.data
      });
    },

    openChat() {
      this.isChatOpen = true;
      this.newMessagesCount = 0;
    },
    closeChat() {
      this.isChatOpen = false;
    }
  },
  computed: {
    porCompletar: function() {
      var pendiente = 0;
      for (var i = 0; i < this.tareas.length; i++) {
        if (this.tareas[i].Completada == false) {
          pendiente++;
        }
      }
      return pendiente;
    },
    ordenTareas: function() {
      return _.orderBy(this.tareas, "Prioridad");
    },
    filteredItems: function() {
      return this.ordenTareas.filter(tarea => {
        return (
          tarea.Tarea.toLowerCase().indexOf(this.nuevatarea.toLowerCase()) > -1
        );
      });
    }
  },
  components: {
    FilePond
  }
};
</script>
<style>
.user-list {
  background-color: #2c3e50;
}
</style>