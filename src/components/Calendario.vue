<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">

          <!-- Botón Agregar Evento -->
          <v-btn color="primary" dark class="mr-4" @click="dialog =true"> Agregar</v-btn>

          <v-btn outlined class="mr-4" @click="setToday">
            Hoy
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn
                outlined
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Día</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 días</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :event-margin-bottom="3"
          :now="today"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
          @weekdays="[1,2,3,4,5,6,0]" 
          locale="es"
          :short-weekdays="true"
        ></v-calendar>

        <!-- Agregar Modal Agregar Evento -->
        <v-dialog v-model="dialog" max-width="600">
            <v-card>
                <v-container>
                   <v-form @submit.prevent="addEvent">
                    <v-text-field 
                        type="text" label="Agregar Nombre" v-model="name">
                    </v-text-field>
                     <v-select
                      v-model="selectedMedico"
                      :items="items"
                      item-value="id"
                      item-text="name"
                      label="Medicos"
                      @change=checkId(selectedMedico.id)
                      return-object
                      required              
                      ></v-select>
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
                  <p v-if="precio>0">Precio: {{precio}}</p>
                    <v-text-field 
                        type="text" label="Agregar Detalle" v-model="details">
                    </v-text-field>
                    <v-text-field 
                        type="date" label="Inico del Evento" v-model="start">
                    </v-text-field>
                     <v-text-field 
                        type="date" label="Fin del Evento" v-model="end">
                    </v-text-field>

                      <div>
                      <h5>Plan your event:</h5>
                      <v-row
                        justify="space-around"
                        align="center"
                      >
                        <v-col style="width: 200px; flex: 0 1 auto;" class="mr-3">
                          <h4>Start:</h4>
                          <v-time-picker
                            v-model="starttime"
                            :max="endtime"
                          ></v-time-picker>
                        </v-col>
                        <v-col style="width: 200px; flex: 0 1 auto;">
                          <h4>End:</h4>
                          <v-time-picker
                            v-model="endtime"
                            :min="starttime"
                          ></v-time-picker>
                        </v-col>
                      </v-row>
                    </div>
                     <v-text-field 
                        type="color" label="Color del Evento" v-model="color">
                    </v-text-field>
                    
                    <v-btn 
                    color="primary" dark 
                    type="submit"  class="mr-4" 
                    @click.stop="dialog=false">
                    Agregar
                    </v-btn>                    
                   </v-form>
                </v-container>
            </v-card>
        </v-dialog>

        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
           offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <!-- Agregar Funcionalidades Editar y Eliminar -->
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn icon @click="deleteEvent(selectedEvent)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
               </v-toolbar>
                    <v-card-text>
                        
                            <v-form v-if="currentlyEditing !== selectedEvent.id">
                                {{selectedEvent.name}} - {{selectedEvent.details}} - Precio: {{selectedEvent.precio}}
                            </v-form>
                            <v-form v-else>
                            <v-text-field
                                    type="text" v-model="selectedEvent.name"
                                    label="Editar Nombre" >
                            </v-text-field>
                              <v-select
                              v-model="selectedMedico"
                              :items="items"
                              item-value="id"
                              item-text="name"
                              label="Medicos"
                              required              
                              ></v-select>

                              <v-select
                              v-model="selectedServicio"
                              :items="itemsServicios"
                               item-text="name"
                                item-value="id"
                              label="Servicios"
                                
                              required              
                              ></v-select>
                              <v-text-field
                                    type="text" v-model="selectedEvent.precio"
                                    label="Editar Precio" 
                                       v-mask="'###.###.###-##'"
                        :value="currentValue" 
                        @input="handleInput">
                              </v-text-field>  
                                 
                            <textarea-autosize outlined v-model="selectedEvent.details"
                                type="text"
                                style="width: 100%"
                                :min-height="100" >                                    
                            </textarea-autosize>
                            </v-form >
                                       
                    </v-card-text>
                    
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
              <v-btn text v-if="currentlyEditing !== selectedEvent.id" 
                @click.prevent="editEvent(selectedEvent.id)">Editar</v-btn>                
              <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">Guardar Cambios</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import {db} from '../main';
  export default {
    name:'Calendario',
    data: () => ({
      today: new Date().toISOString().substr(0, 10),
      focus: new Date().toISOString().substr(0, 10),
      type: 'month',
      typeToLabel: {
        month: 'Mes',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      start: null,
      end: null,
      starttime:null,
      endtime:null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      servicios:[],
      selectedMedico:null,
      selectedServicio:null,
      // Adicionales...
      name: null,
      precio:0,
      details: null,
      color: '#1976D2',
      dialog: false, 
      idagenda:null,
      idmedico:null,
      currentlyEditing: null,
      selectMedicos:[],
      itemsServicios:[],
items: [], 
    }),
    computed: {
      title () {
        const { start, end } = this
        if (!start || !end) {
          return ''
        }

        const startMonth = this.monthFormatter(start)
        const endMonth = this.monthFormatter(end)
        const suffixMonth = startMonth === endMonth ? '' : endMonth

        const startYear = start.year
        const endYear = end.year
        const suffixYear = startYear === endYear ? '' : endYear

        const startDay = start.day + this.nth(start.day)
        const endDay = end.day + this.nth(end.day)

        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`
          case 'week':
          case '4day':
            return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
          case 'day':
            return `${startMonth} ${startDay} ${startYear}`
        }
        return ''
      },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
    },
    mounted () {
      this.$refs.calendar.checkChange();
      
    },
    created(){
        this.getEvents();
        this.getMedicos();
        this.getServicios();
    },
    methods: {
      getPrecio(x){
       this.precio=x;
      },
      checkId(id){
          console.log(id);
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

           // console.log(this.itemsServicios);
            
        } catch (error) {
            console.log(error);
        }        
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
                           
              this.items.push({name:x.name,id:x.id });
            });

           // datos.forEach( (i) => this.items.push( () => i  ) )

          //  console.log(this.items);
            
        } catch (error) {
            console.log(error);
        }        
      },
    async updateEvent(ev){
         
        try {
                await db.collection('eventos').doc(ev.id).update({
                        details: ev.details,
                        name: ev.name,
                        servicio:this.selectedServicio,
                        medico: this.selectedMedico.name,
                        idmedico:this.selectedMedico.id,
                        precio: this.selectedEvent.precio
                        
                    })  
                        this.selectedOpen = false;
                        this.currentlyEditing = null;
                        this.getEvents();
            } catch (error) {
            console.log(error);
        }
    },
    editEvent(id){
            this.currentlyEditing=id;   
            //console.log(this.currentlyEditing);
            //this.selectedMedico=this.events[id].medico;
               this.events.forEach((x) => {
                  // console.log(this.currentlyEditing);
                    if(x.id===this.currentlyEditing){
                          // Selecciona el médico correspondiente.
                          this.selectedMedico=x.medico;
                          this.selectedServicio=x.servicio;
                         
                      }
                    });
             // this.items.push(x.name);
              
            
        },
    async deleteEvent(ev){
       
            try {
                await db.collection('eventos').doc(ev.id).delete();
                this.selectedOpen= false;
                this.getEvents();
            } catch (error) {
                console.log(error);
            }    

        },
    
    async addEvent(){
        try {
            if(this.name && this.start &&  this.end){
                await db.collection('eventos').add({
                    name: this.name,
                    details: this.details,
                    start: this.start,
                    end:this.end,
                    starttime: this.starttime,
                    endtime:this.endtime,
                    color: this.color,
                    //idmedico:this.selectedMedico.id,
                    idgenda:this.idagenda,
                    medico: this.selectedMedico,
                    servicio: this.selectedServicio,
                   // precio:this.precio
                    
                })
                    this.getEvents();
                    this.name=null;
                    this.details=null;
                    this.start=null;
                    this.end=null;
                    this.color='#1976D2';
                    this.selectedMedico=null;
                    this.selectedServicio=null;
                    this.precio=0;
             }else{
                console.log('Campos obligatorios');
            }
        } catch (error) {
             console.log(error)
        }    
    },
      async  getEvents(){
        try {
            const snapshot = await db.collection('eventos').get();
            const events = [];
            snapshot.forEach(doc =>{
                console.log(doc.data());
                let eventoData = doc.data();
                eventoData.id=doc.id;
                events.push(eventoData);
            })
            this.events = events;
        } catch (error) {
            console.log(error);
        }        
      },

      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = this.today
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
        this.start = start
        this.end = end
      },
      nth (d) {
        return d > 3 && d < 21
          ? 'th'
          : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
      },
    },
  }
</script>