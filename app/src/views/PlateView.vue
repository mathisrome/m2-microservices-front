<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const loading = ref(false);
const toast = useToast();
const router = useRouter();

const selectedPlateType = ref();
const filteredPlateType = ref();

const plateTypes = ref([
    { name: 'Entrée', code: 1 },
    { name: 'Plat', code: 2 },
    { name: 'Dessert', code: 3 },
    { name: 'Boisson', code: 4 },
]);

const initialValues = ref({
    name: '',
    price: null,
    plate_type: null
});

const emit = defineEmits(['close']);

const createPlate = async (plateData: any) => {
    loading.value = true;
    try {
        console.log("Objet envoyé :", plateData);

        const response = await fetch('http://localhost:84/api/kitchen/1.0/plates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify(plateData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erreur de validation:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Plat créé avec succès:', result);

        // Réinitialisation des champs après succès
        initialValues.value = {
            name: '',
            price: null,
            plate_type: null
        };

        router.push({ name: "plate", query: { showLoggedToast: 1 } });
        plates.value = result
        return result

    } catch (error) {
        toast.add({ severity: 'error', summary: 'Problème lors de la création du plat', life: 3000 });
        console.error('Erreur lors de la création du plat:', error);
        alert('Une erreur est survenue lors de la création du plat. Veuillez réessayer.');
    } finally {
        loading.value = false;
    }
};

const updatePlateFetch = async (plateData: any) => {
    loading.value = true;
    try {
        const response = await fetch(`http://localhost:84/api/kitchen/1.0/plates/${editingPlate.value.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify(plateData)
        });

        console.log(plateData.name)

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erreur de validation:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Plat mis à jour avec succès:', result);

        return result

        // Actualisez la liste des plats ou mettez à jour l'UI ici
        toast.add({ severity: 'success', summary: 'Plat mis à jour', detail: 'Le plat a été mis à jour avec succès', life: 3000 });
        
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erreur de mise à jour', detail: 'Problème lors de la mise à jour du plat', life: 3000 });
        console.error('Erreur lors de la mise à jour du plat:', error);
    } finally {
        loading.value = false;
    }
};

const getAllPlates = async () => {
    loading.value = true;
    try {
        const response = await fetch('http://localhost:84/api/kitchen/1.0/plates', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem("token")
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erreur de validation:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        plates.value = result

    } catch (error) {
        console.error('Erreur lors de la récupération des plats:', error);
        alert('Une erreur est survenue lors de la récupération des plats. Veuillez réessayer.');
    } finally {
        loading.value = false;
    }
}

const deletePlate = async (id: number) => {
    try {
        const response = await fetch(`http://localhost:84/api/kitchen/1.0/plates/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem("token")
            }
        });

        // Vérifiez si la suppression s'est bien déroulée
        if (!response.ok) {
            throw new Error(`Erreur lors de la suppression: ${response.status}`);
        }

        if (plateData.value && plateData.value[plateData.value.id]) {
            delete plateData.value[plateData.value.id];
        }

        deleteProductDialog.value = false;
        editingPlate.value = {
            name: '',
            price: null,
            plate_type: null
        };

        toast.add({ severity: 'success', summary: 'Succès', detail: 'Produit supprimé', life: 3000 });
    } catch (error) {
        console.error("Erreur lors de la suppression du produit:", error);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression du produit', life: 3000 });
    }
};


const selectedPlates = ref();
const plates = ref([]);  
const editingPlate = ref({
    name: '',
    price: null,
    plate_type: null
});

const editPlate = (prod: any) => {
    editingPlate.value = {...prod};
    plateDialogEdit.value = true
};

const openNew = () => {
    editingPlate.value = { name: '', price: null, plate_type: null };  // Initialiser avec des valeurs vides pour un nouveau plat
    submitted.value = false;
    plateDialog.value = true;
};

const submitted = ref(false);
const plateDialog = ref(false);
const plateDialogEdit = ref(false);
const deleteProductDialog = ref(false);

const hideDialog = () => {
    plateDialog.value = false;
    plateDialogEdit.value = false;
    submitted.value = false;
};

const updatePlate = async () => {
    submitted.value = true

    const plateData = {
        name: editingPlate.value.name,
        price: editingPlate.value.price,
        plateType: editingPlate.value.plate_type?.code
    }

    try {
        const updatePlate = await updatePlateFetch(plateData)

        plates.value.push(updatePlate)
        plateDialog.value = false
        editingPlate.value = { name: '', price: null, plate_type: null };
    } catch (error) {
        // L'erreur est déjà gérée dans updatePlateFetch
    }
}

const savePlate = async () => {
    submitted.value = true

    if (editingPlate.value.name.trim() && editingPlate.value.price && editingPlate.value.plate_type) {
        const plateData = {
            name: editingPlate.value.name,
            price: editingPlate.value.price,
            plateType: editingPlate.value.plate_type.code
        };

        try {
            const newPlate = await createPlate(plateData)
            
            // Ajouter le nouveau plat à la liste des plats
            plates.value.push(newPlate)
            
            plateDialog.value = false;
            editingPlate.value = { name: '', price: null, plate_type: null };
        } catch (error) {
            // L'erreur est déjà gérée dans createPlate
        }
    }
};

const confirmDeletePlate = async (id: number) => {
    submitted.value = true

    try {
        const plateDelete = await deletePlate(id)

        const plateKey = plates.value.findIndex((plate) => {
            return id === plate.id
        })
        plates.value.splice(plateKey, 1)
    } catch (error) {

    }

    deleteProductDialog.value = true;
};

onMounted(() => {
  getAllPlates()
})

</script>

<template>
  <section class="card">
    <h1 class="mb-3">Gestion des plats</h1>
    <div>
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Ajouter un plat" icon="pi pi-plus" class="mr-2" @click="openNew" />
            </template>
        </Toolbar>

        <DataTable
                ref="dt"
                v-model:selection="selectedPlates"
                :value="plates"
                dataKey="id"
                :paginator="true"
                :rows="10"
            >
                <Column field="name" header="Nom" sortable style="min-width: 16rem"></Column>
                <Column field="price" header="Prix" sortable style="min-width: 8rem">
                </Column>
                <Column field="plateType" header="Type" sortable style="min-width: 10rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editPlate(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeletePlate(slotProps.data.id)" />
                    </template>
                </Column>
            </DataTable>
    </div>

    <Dialog v-model:visible="plateDialog" :style="{ width: '450px' }" header="Détails du plat" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Nom</label>
                    <InputText id="name" v-model.trim="editingPlate.name" required="true" autofocus :invalid="submitted && !editingPlate.name" fluid />
                    <small v-if="submitted && !editingPlate.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="plateType" class="block font-bold mb-3">Type de plat</label>
                    <Select id="plateType" v-model="editingPlate.plate_type" :options="plateTypes" optionLabel="name" placeholder="Sélectionner un type" fluid></Select>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Prix</label>
                        <InputNumber id="price" v-model="editingPlate.price" mode="currency" currency="EUR" locale="fr-FR" fluid />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Annuler" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Enregistrer" icon="pi pi-check" @click="savePlate" />
            </template>
        </Dialog>

        <Dialog v-model:visible="plateDialogEdit" :style="{ width: '450px' }" header="Détails du plat" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Nom</label>
                    <InputText id="name" v-model.trim="editingPlate.name" required="true" autofocus :invalid="submitted && !editingPlate.name" fluid />
                    <small v-if="submitted && !editingPlate.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="plateType" class="block font-bold mb-3">Type de plat</label>
                    <Select id="plateType" v-model="editingPlate.plate_type" :options="plateTypes" optionLabel="name" placeholder="Sélectionner un type" fluid></Select>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Prix</label>
                        <InputNumber id="price" v-model="editingPlate.price" mode="currency" currency="EUR" locale="fr-FR" fluid />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Annuler" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Enregistrer" icon="pi pi-check" @click="updatePlate" />
            </template>
        </Dialog>
  </section>
</template>

<style scoped>
</style>
