<template>
<v-container>
  <v-data-table
    :headers="headers"
    :items="medicos"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title >Profesionales</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Agregar +
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="primary">
              <span class="text-h5 ">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form>
                  <v-col
                   
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Nombres"
                    ></v-text-field>
                  </v-col>
                  <v-col
                  
                  >
                  </v-col>
                  <v-col
                    >
                    <v-text-field
                      v-model="editedItem.email"
                      label="Email"
                    ></v-text-field>
                  </v-col>
                 
                  <v-col
                   > 
                   <v-select
                  v-model="select"
                  :items="items"
                  :rules="[v => !!v || 'Especialidad es requerido']"
                  label="Especialidad"
                  required
                  autocomplete
                  
                  ></v-select>
                  </v-col>
               
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="600px">
          <v-card>
            <v-card-title class="text-h5">Estás seguro que deseas eliminar el item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="getMedicos()"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</v-container>
</template>

<script>
import {db} from '../main';
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Nombres',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Email', value: 'email' },
        { text: 'Especialidad', value: 'especialidad' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      medicos: [],
      editedIndex: -1,
      editedItem: {
        name: null,
        email: null,
        select: null,
         
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      select: null,
      items: [
        'Clínico Familiar',
        'Oftalmólogo',
        'Urólogo',
        'Ginecología',
      ],
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo Médico' : 'Editar Médico'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.getMedicos()
    },

    methods: {

      async  getMedicos(){
        try {
            const snapshot = await db.collection('medicos').get();
            const events = [];
            
            snapshot.forEach(doc =>{
                console.log(doc.data());
                let eventoData = doc.data();
                eventoData.id=doc.id;
                events.push(eventoData);
            })
            this.medicos = events;
        } catch (error) {
            console.log(error);
        }        
      },
     

      editItem (item) {
        this.select=null
        this.editedIndex = this.medicos.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.select=item.especialidad
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.medicos.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

     async deleteItemConfirm () {
        
        const id=this.medicos[this.editedIndex].id;
             try {
                await db.collection('medicos').doc(id).delete();
                
                this.getMedicos();

                this.closeDelete();
                
            } catch (error) {
                console.log(error);
            }    
        //this.medicos.splice(this.editedIndex, 1).id
        
        
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

    async  save () {
        if (this.editedIndex > -1) {
            const id=this.medicos[this.editedIndex].id;
             const ev=Object.assign(this.medicos[this.editedIndex], this.editedItem);
             // console.log(ev.name);
            try {
                await db.collection('medicos').doc(id).update({
                        especialidad: this.select,
                        name: ev.name,
                        email: ev.email  
                    })  
                  this.getMedicos();
               // this.selectedOpen = false;
               // this.currentlyEditing = null;
            } catch (error) {
            console.log(error);
        }
        } else {
              const ev= this.editedItem;
              try {
                  await db.collection('medicos').add({
                    name: ev.name,
                    especialidad: this.select,
                    email: ev.email
                   })
                    this.name=null;
                    this.especialidad=null;
                    this.email=null;
                    this.getMedicos();
                    
              } catch (error) {
                console.log(error);
              }

        }
        this.close()
      },
    },
  }
</script>