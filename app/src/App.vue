<script setup lang="ts">
import {ref} from "vue";
import SidebarComponent from "@/components/SidebarComponent.vue";

const visible = ref(false);
</script>

<template>
  <SidebarComponent/>
  <main>
    <RouterView/>
  </main>
</template>

<style scoped>

</style>
