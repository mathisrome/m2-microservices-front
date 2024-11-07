<script setup lang="ts">
import {computed, ref} from "vue";
import {useAuthStore} from "@/stores/auth";
import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";

const router = useRouter()
const toast = useToast()

const authStore = useAuthStore()
const username = ref<String>()
const password = ref<String>()

const form = {
  username: ref<string>(""),
  password: ref<string>(""),
}

const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
const isUsernameValid = computed(() => emailRegex.test(form.username.value));
const isPasswordValid = computed(() => form.password.value.trim() !== '');

const submit = async () => {
  if (isUsernameValid && isPasswordValid) {
    const logged = await authStore.login(form.username.value, form.password.value)

    if (logged) {
      router.push({name: "order", query: {showLoggedToast: 1}})
    } else {
      toast.add({ severity: 'error', summary: 'Identifiant invalide', life: 3000 });
    }
  }
}
</script>

<template>
  <Toast/>
  <section class="card">
    <h1 class="mb-3">Se connecter</h1>
    <form @submit.prevent="submit">
      <div class="flex flex-column gap-2 mb-3">
        <label for="username">Email</label>
        <InputText :invalid="!isUsernameValid" id="username" v-model="form.username.value" aria-describedby="username-help"/>
      </div>
      <div class="flex flex-column gap-2 mb-3">
        <label for="username">Password</label>
        <Password :invalid="!isPasswordValid" v-model="form.password.value" :feedback="false" inputClass="w-full"></Password>
      </div>
      <Button label="Se connecter" type="submit"></Button>
    </form>
  </section>
</template>

<style scoped>

</style>