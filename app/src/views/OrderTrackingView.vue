<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useAuthStore} from "@/stores/auth";

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const orders = ref([]);
const sendOrder = async () => {
  const response = await fetch('http://localhost:84/api/order/1.0/orders?user=' + user.value.uuid, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur de validation:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

  orders.value = result
    console.log('Commande affichée avec succès:', result);
};

onMounted (() => {
    sendOrder();
})
</script>

<template>
  <section class="card">
    <h1 class="mb-3">Mes commandes</h1>

    <DataTable :value="orders" tableStyle="min-width: 50rem">
      <Column header="Detail">
        <template #body="slotProps">
          <template v-for="(detail, key) of slotProps.data.details">
            <span v-if="key !== slotProps.data.details.length - 1">{{detail.plate.name}} x{{detail.quantity}} ({{detail.plate.price * detail.quantity}} €), </span>
            <span v-else>{{detail.plate.name}} x{{detail.quantity}} ({{detail.plate.price * detail.quantity}} €)</span>
          </template>
        </template>
      </Column>
      <Column header="Adresse">
        <template #body="slotProps">
          {{slotProps.data.address1}}
          {{slotProps.data.address2}}
          {{slotProps.data.postalCode}}
          {{slotProps.data.city}}
          {{slotProps.data.country}}
        </template>
      </Column>
      <Column header="Statut">
        <template #body="slotProps">
          <span v-if="slotProps.data.status === 1">En attente</span>
          <span v-else-if="slotProps.data.status === 2">En préparation</span>
          <span v-else-if="slotProps.data.status === 3">En livraison</span>
          <span v-else>Livrée</span>
        </template>
      </Column>
    </DataTable>
  </section>
</template>

<style scoped>

</style>