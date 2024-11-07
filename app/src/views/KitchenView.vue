<script setup lang="ts">
import {onMounted, ref} from 'vue';

const plates = ref([]);
const loading = ref(true);

const fetchOrders = async () => {
  loading.value = true;
  console.log(localStorage.getItem('token'));

    try {
        const response = await fetch('http://localhost:84/api/kitchen/1.0/orders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
      const orders = await response.json();
      const plateData: any = []

      orders.forEach((order: any) => {
        plateData.push(order.plates)
      })

      plates.value = plateData
      console.log(plates.value)
    } catch (error) {
        console.error('Error fetching orders:', error);
    } finally {
        loading.value = false;
    }
};

const updatePlateStatus = async (orderId, plateId, status) => {
  try {
    const response = await fetch('http://localhost:84/api/kitchen/1.0/orders/' + orderId + '/plates/' + plateId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({status: status}),
    });
    if (!response.ok) {
      throw new Error('Failed to update plate status');
    }
    await fetchOrders();
  } catch (error) {
    console.error('Error updating plate status:', error);
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="card">
    <h1>Tableau de Bord de la Cuisine</h1>
    <div v-if="loading" class="loading">
      <ProgressSpinner/>
    </div>
    <div v-else>
      <DataTable :value="plates" responsiveLayout="scroll">
        <Column field="name" header="Nom">
          <template #body="slotProps">
            {{ slotProps.data[0].name }}
          </template>
        </Column>
        <Column field="status" header="Statut">
          <template #body="slotProps">
            {{ slotProps.data[0].status }}
          </template>
        </Column>
        <Column header="Actions">

          <template #body="slotProps">
            <Button v-if="slotProps.data[0].status === 'En attente'"
                    @click="updatePlateStatus(slotProps.data[0].orderId, slotProps.data[0].id, 'En préparation')">
              Passer à "En préparation"
            </Button>
            <Button v-else @click="updatePlateStatus(slotProps.data[0].orderId, slotProps.data[0].id, 'Prêt à servir')">
              Passer à "Prêt à servir"
            </Button>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>