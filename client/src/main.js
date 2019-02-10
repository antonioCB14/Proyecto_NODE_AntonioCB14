import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueSocketIO from 'vue-socket.io'
import Notifications from 'vue-notification'
import Chat from 'vue-beautiful-chat'

// Chat
Vue.use(Chat)

// Notificaciones
Vue.use(Notifications)

// SocketIO
Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://127.0.0.1:3000',
}))

//Bootstrap framework
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

//Font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleUp, faAngleDown, faMinusCircle, faChartBar, faTimes, faTemperatureLow, faTemperatureHigh, faTint, faSun, faAngleDoubleUp, faAngleDoubleDown, faCloud, faUser } from '@fortawesome/free-solid-svg-icons'
import { faCircle, faCheckCircle, faClock } from '@fortawesome/free-regular-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUser,faGithub,faAngleDown,faAngleUp,faMinusCircle,faCheckCircle,faCircle,faChartBar,faTimes,faClock,faTemperatureLow,faTemperatureHigh,faTint,faSun,faAngleDoubleUp,faAngleDoubleDown,faCloud)

Vue.component('font-awesome-icon', FontAwesomeIcon)

// Lodash --> Tratamiendo de Array
import VueLodash from 'vue-lodash'
const options = { name: 'lodash' } // customize the way you want to call it
Vue.use(VueLodash, options) // options is optional

// Moment --> Calcular el "Time Ago"
Vue.use(require('vue-moment'));

// Axios --> Consumir APIs
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
