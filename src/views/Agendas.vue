
<template>
<div>
   
<v-container>
      <v-select
      v-model="SelectedMedico"
      :items="medicos"
       item-text="name"
      item-value="name"    
      label="Médicos"
     @change=getEvents(SelectedMedico)   
      clearable
    ></v-select>
                    
  <v-data-table
    :headers="headers"
    :items="eventos"
    sort-by="medicos"
    class="elevation-1"
     
  >
    <template v-slot:top>



      <v-toolbar
        flat
      >
        <v-toolbar-title >Agenda de Profesionales</v-toolbar-title>
             
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
                  <v-col >            
                  
                 <v-select
                      v-model="selectedServicio"
                      :items="itemsServicios"
                      item-text="name"
                      item-value="id"
                      label="Servicios"
                      return-object
                      required 
                      @change=getPrecio(selectedServicio.precio)             
                      > 
                          
                      </v-select>
                  <v-text><p v-if="precio>0">Precio: {{precio}}</p></v-text>
                  </v-col>
                  <v-col  >
                    <v-text-field 
                        type="date" label="Inico del Evento" v-model="editedItem.start">
                    </v-text-field>
                  </v-col>
                  <v-col >
                     <v-text-field 
                        type="date" label="Fin del Evento" v-model="editedItem.end">
                    </v-text-field>
                    </v-col>
                  <v-col>
                      <v-select
                      v-model="SelectedMedico"
                      :items="medicos"
                      item-text="name"
                      item-value="name"    
                      label="Médicos"
                    
                      clearable
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
        @click="getEventos()"
      >
        Reset
      </v-btn>

    </template>


  </v-data-table>
        
</v-container>

</div>
</template>

<script>
import {db} from '../main';
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
            text:'Id', value:'id'
        },
        {
          text: 'Nombres',
          align: 'start',
          sortable: true,
          value: 'medico',
        },
        { text: 'Agenda', value: 'start' },
       // { text: 'Especialidad', value: 'especialidad' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      datos:[],
      xname:null,
      SelectedMedico:null,
      selectedServicio:null,
      editedIndex: -1,
      editedItem: {
        name: null,
        start: null,
        end: null
       
         
      },
      defaultItem: {
        name: '',
        precio: 0
        
      },
         itemsServicios:[],
        eventos:[],
        medicos:[],
 /*select: null,
      items: [
        'Clínico Familiar',
        'Oftalmólogo',
        'Urólogo',
        'Ginecología',
      ],*/
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo Servicio' : 'Editar Servicio'
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
     // this.getEvents(this.xname);
      this.getMedicos();
this.getServicios();
    },  

    methods: {
            getPrecio(x){
       this.precio=x;
      },
      async  getServicios(){
       try {
            const snapshot = await db.collection('servicios').get();
            const datos = [];
            
            snapshot.forEach(doc =>{
                console.log(doc.data());
                let eventoData = doc.data();
                eventoData.id=doc.id;
                datos.push(eventoData);
            })
            //this.items = events;

           datos.forEach((x) => {
                           
              this.itemsServicios.push({name:x.name, id:x.id, precio:x.precio});
            });
              //console.log(this.itemsServicios);

           // datos.forEach( (i) => this.items.push( () => i  ) )

            console.log(this.itemsServicios);
            
        } catch (error) {
            console.log(error);
        }        
      },
          async  buscarMedico(name){
          this.datos=[];
         //  alert(name);
          var xname=name;
         // var cnt=0;
       

        try {
          this.eventos.forEach(object =>{
        if(object.medico === xname){
           // cnt++;
            this.datos.push(object);
      
        }   
      });
        } catch (error) {
          console.log(error);
        }


       
        console.log(this.datos);
        this.medicos=this.datos;
        // this.medicos.push({id:x.id, name:x.name});  
        // alert(datos);
          //console.log(this.datos);
             
        },

    async  getMedicos(){
       try {
            const snapshot = await db.collection('medicos').get();
            const datos = [];
            
            snapshot.forEach(doc =>{
                console.log(doc.data());
                let eventoData = doc.data();
                eventoData.id=doc.id;

                datos.push(eventoData);
            })
            //this.items = events;

           datos.forEach((x) => {
                     this.medicos.push({id:x.id, name:x.name});  
                      
            });

           // datos.forEach( (i) => this.items.push( () => i  ) )

          //  console.log(this.items);
            
        } catch (error) {
            console.log(error);
        }        
      },
      async  getEvents(xname){
           
        try {
            const snapshot = await db.collection('eventos').get();
            const events = [];
            
            snapshot.forEach(doc =>{
                console.log(doc.data());
                let eventoData = doc.data();
                eventoData.id=doc.id;
                events.push(eventoData);
            })
                
           this.eventos=[];
           events.forEach((x) => {
                  if(x.medico===xname){  this.eventos.push({id:x.id, name:x.name,medico:x.medico,start:x.start});  }  
                  
                      
            });
          //  this.eventos = events;
        } catch (error) {
            console.log(error);
        }        
      },
     

      editItem (item) {
        this.select=null
        this.editedIndex = this.servicios.indexOf(item)
        this.editedItem = Object.assign({}, item)
      //  this.select=item.especialidad
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.servicios.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

     async deleteItemConfirm () {
        
        const id=this.servicios[this.editedIndex].id;
             try {
                await db.collection('servicios').doc(id).delete();
                
                this.getServicios();

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
            const id=this.servicios[this.editedIndex].id;
             const ev=Object.assign(this.servicios[this.editedIndex], this.editedItem);
             // console.log(ev.name);
            try {
                await db.collection('servicios').doc(id).update({
                        name: ev.name,
                        precio: ev.precio  
                    })  
                  this.getServicios();
               // this.selectedOpen = false;
               // this.currentlyEditing = null;
            } catch (error) {
            console.log(error);
        }
        } else {
              const ev= this.editedItem;
              try {
                  await db.collection('servicios').add({
                    name: ev.name,
                   // especialidad: this.select,
                    precio: ev.precio
                   })
                    this.name=null;
                    this.precio=null;
                    this.getServicios();
                    
              } catch (error) {
                console.log(error);
              }

        }
        this.close()
      },
    },
  }
</script>