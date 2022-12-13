import { createApp } from "vue";
import App from "./app.vue";
import WIcon from "@h-material/components/icon";
import "@h-material/theme-chalk/src/index.scss";

const app = createApp(App);
app.use(WIcon);
app.mount("#app");
