<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useAuthStore} from "@/stores/auth";

const deliveries = ref([]);
const loading = ref(true);

const fetchDeliveries = async () => {
  loading.value = true;
  console.log(localStorage.getItem('token'));

    try {
        const response = await fetch('http://localhost:80/api/delivery/1.0/deliveries', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch deliveries');
        }
        const deliveryData = await response.json();

        deliveries.value = deliveryData;
      console.log(deliveries.value)
    } catch (error) {
        console.error('Error fetching deliveries:', error);
    } finally {
        loading.value = false;
    }
};

const userId = ref(123); // Remplacez 123 par l'ID réel du livreur

const takeCharge = async (deliveryId: number, uuid: any) => {
  try {
    const response = await fetch(`http://localhost:80/api/delivery/1.0/deliveries/${deliveryId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ 
        uuid: uuid
    })
    });

    if (!response.ok) {
      throw new Error('Failed to update delivery');
    }

    // Mettre à jour le champ 'deliverer' et changer le statut en 'in_delivery' localement
    const deliveryIndex = deliveries.value.findIndex(delivery => delivery.id === deliveryId);
    if (deliveryIndex !== -1) {
      deliveries.value[deliveryIndex].deliverer = userId.value;
      deliveries.value[deliveryIndex].status = 'in_delivery';  // Change le statut à 'in_delivery'
    }
  } catch (error) {
    console.error('Error taking charge of delivery:', error);
  }
};

const delivered = async (deliveryId: number) => {
  try {
    const response = await fetch(`http://localhost:80/api/delivery/1.0/deliveries/${deliveryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ 
        status: 'delivered',
        id: deliveryId
    })
    });

    if (!response.ok) {
      throw new Error('Failed to update delivery');
    }

    // Changer le statut à 'delivered' localement
    const deliveryIndex = deliveries.value.findIndex(delivery => delivery.id === deliveryId);
    if (deliveryIndex !== -1) {
      deliveries.value[deliveryIndex].status = 'delivered';
    }

  } catch (error) {
    console.error('Error updating delivery status to delivered:', error);
  }
};

onMounted(() => {
  fetchDeliveries();
});
</script>

<template>
  <section class="card">
    <h1 class="mb-3">Mes livraisons</h1>

    <div v-if="loading" class="loading">
      <ProgressSpinner/>
    </div>
    <div v-else>
        <DataTable :value="deliveries" responsiveLayout="scroll">
            <Column field="user.firstname" header="Nom du client">
                <template #body="slotProps">
                {{ slotProps.data.user.lastname }}
                </template>
            </Column>
            <Column field="user.firstname" header="Prénom du client">
                <template #body="slotProps">
                {{ slotProps.data.user.firstname }}
                </template>
            </Column>
            <Column field="user.orderAddress" header="Adresse de livraison">
                <template #body="slotProps">
                {{ slotProps.data.orderAddress }}
                </template>
            </Column>
            <Column field="user.phoneNumber" header="Téléphone">
                <template #body="slotProps">
                {{ slotProps.data.user.phoneNumber }}
                </template>
            </Column>
            <Column field="status" header="Statut">
                <template #body="slotProps">
                {{ slotProps.data.status }}
                </template>
            </Column>
            <Column header="Actions">
              <template #body="slotProps">
                  <!-- Si le statut est 'ready' et le livreur est 'null', afficher le bouton "Prendre en charge" -->
                  <div v-if="slotProps.data.status === 'ready' && slotProps.data.deliverer === null">
                      <Button @click="takeCharge(slotProps.data.id, slotProps.data.user.uuid)">
                          Prendre en charge la commande
                      </Button>
                  </div>

                  <!-- Si le statut est 'in_delivery', afficher le bouton "Livrée ?" -->
                  <div v-else-if="slotProps.data.status === 'in_delivery'">
                      <Button @click="delivered(slotProps.data.id)">
                          Livrée ?
                      </Button>
                  </div>

                  <!-- Si le statut n'est pas 'ready' ou 'in_delivery', afficher "Commande livrée" -->
                  <div v-else>
                      <span>Commande livrée</span>
                  </div>
              </template>
          </Column>
        </DataTable>
    </div>


  </section>
</template>

<style scoped>

</style>
