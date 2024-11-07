import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ToastService from 'primevue/toastservice';

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import MegaMenu from "primevue/megamenu";
import Menubar from "primevue/menubar";
import Image from "primevue/image";
import Menu from "primevue/menu";
import Badge from "primevue/badge";
import Button from "primevue/button";
import Drawer from "primevue/drawer";
import Avatar from "primevue/avatar";
import TieredMenu from "primevue/tieredmenu";
import PanelMenu from "primevue/panelmenu";
import Password from "primevue/password";
import InputText from "primevue/inputtext";
import Toast from 'primevue/toast';
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
import Paginator from "primevue/paginator";
import AutoComplete from "primevue/autocomplete";
import Carousel from 'primevue/carousel';
import Toolbar from 'primevue/toolbar';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(ToastService);

// Form
app.component("Password", Password)
app.component("InputText", InputText)
app.component("AutoComplete", AutoComplete)
app.component("Select", Select)
app.component("InputNumber", InputNumber)

// Button
app.component("Button", Button)

// Data
app.component("DataTable", DataTable)
app.component("Column", Column)
app.component("ColumnGroup", ColumnGroup)
app.component("Row", Row)
app.component("Paginator", Paginator)
app.component("Toolbar", Toolbar)
app.component("Dialog", Dialog)

// Overlay
app.component("Drawer", Drawer)

// Composant Menu
app.component("Menu", Menu)
app.component("Menubar", Menubar)
app.component("MegaMenu", MegaMenu)
app.component("PanelMenu", PanelMenu)
app.component("TieredMenu", TieredMenu)

// Message
app.component("Toast", Toast)
app.component("Message", Message)

// Media
app.component("Image", Image)
app.component("Carousel", Carousel)

// Misc
app.component("Avatar", Avatar)
app.component("Badge", Badge)
app.component("ProgressSpinner", ProgressSpinner)

app.mount('#app')
