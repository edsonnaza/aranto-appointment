<template>
<v-container class="center">       
 <h1 class="mt-3">Crear Nueva Agenda</h1>
  <v-spacer></v-spacer>  
  <form>
    <v-row>
    <v-col  cols="12"
      sm="6">
    <v-text-field
      v-model="name_agenda"
      :error-messages="nameErrors"
      :counter="10"
      label="Nombre de la Agenda"
      required
      @input="$v.name_agenda.$touch()"
      @blur="$v.name_agenda.$touch()"
    ></v-text-field>
 </v-col>
   </v-row>

 <v-row>
    <v-col  cols="12"
       
      sm="6">
    <v-select
      v-model="selectMedico"
      :items="itemsMedicos"
      :error-messages="selectErrors"
      label="Médicos"
       item-text="name"
     item-value="id"
       return-object
      required
      @change="$v.selectMedico.$touch()"
      @blur="$v.selectMedico.$touch()"
    ></v-select>
</v-col>
</v-row>

<v-row>
    <v-col
      cols="12"
      sm="6"
    >
      <v-date-picker
        v-model="dates"
        multiple
      ></v-date-picker>
    </v-col>
    <v-col
      cols="12"
      sm="6"
    >
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="dates"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-combobox
            v-model="dates"
            multiple
            chips
            small-chips
            label="Multiple picker in menu"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-combobox>
        </template>
        <v-date-picker
          v-model="dates"
          multiple
          no-title
          scrollable
        >
          
          <v-btn
            text
            color="primary"
            @click="menu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.menu.save(dates)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
<v-row 
      justify="space-around"
      align="center"
    >
      <v-col cols="12" lg="12"  sm="6" style="width: 250px; flex: 0 1 auto;">
        <h4>Inicio:</h4>
        <v-time-picker 
          v-model="start"
          :max="end"
             format="24hr"
            
        ></v-time-picker>
      </v-col>
      <v-col cols="12" lg="12" sm="6" style="width: 250px; flex: 0 1 auto;">
        <h4>Final:</h4>
        <v-time-picker
          v-model="end"
          :min="start"
             format="24hr"
        ></v-time-picker>
      </v-col>
    </v-row>
    </v-col>
  </v-row>
  <v-col
      cols="12"
      sm="6"
    >
    <v-select
      v-model="selectIntervalo"
      :items="itemsIntervalos"
      :error-messages="selectIntervaloErrors"
      label="Intervalos"
      required
      @change="$v.selectIntervalo.$touch()"
      @blur="$v.selectMedico.$touch()"
    ></v-select>
 </v-col>
 <v-text-field 
    type="color" height="15" label="Color del Evento" v-model="color">
</v-text-field>
      
<v-row>
    <v-col cols="12" lg="12" sm="6">
  <h4>Rango de horarios:</h4>
    <v-card>
    <v-tabs
      v-model="tab"
      background-color="primary"
      dark
        
    >
      <v-tab  v-model="tab"
        v-for="item in items"
        :key="item.tab"
      >
        {{ item.tab }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="item in items"
        :key="item.tab"
      >
        <v-card flat>
          <v-card-text v-for="content in item.content" :key="content.start">Hora:{{ content.start }}- Status:{{content.status}}<v-btn
          :color="color" 
         
        >
          Color
        </v-btn></v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
       </v-col>
  </v-row>

<v-row>
    <v-btn
      class="mr-4"
      @click="submit"
      
    >
      submit
    </v-btn>
    <v-btn @click="clear">
      clear
    </v-btn>
 <v-btn
      class="mr-4"
      @click="makeSlots()"
      
    >
      Slots
    </v-btn>
</v-row>
  </form>
</v-container>   
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, maxLength } from 'vuelidate/lib/validators'
import moment from 'moment'

import {db} from '../main'
  export default {
    mixins: [validationMixin],

    validations: {
      name_agenda: { required, maxLength: maxLength(10) },
     
      selectMedico: { required },
      selectIntervalo: { required },
      checkbox: {
        checked (val) {
          return val
        },
      },
    },

    data: () => ({
        items: [],
        tab: null,
 color: '#1976D2',
      name_agenda: '',
       
      xstart:null,
      xdate:null,
      xdatetime:[],
    menu:null,
      start:'08:00',
      end: '12:00',
      selectIntervalo:null,
      dates: [],
      slots:[],
      selectMedico: null,
      itemsMedicos: [],
      checkbox: false,
         itemsIntervalos: [
        '15',
        '20',
        '30',
        '60',
      ],

        
    }),
   created () {
         this.getMedicos();
    },
    computed: {
        
            
      selectErrors () {
        const errors = []
        if (!this.$v.selectMedico.$dirty) return errors
        !this.$v.selectMedico.required && errors.push('Item is required')
        return errors
      },
        selectIntervaloErrors () {
        const errors = []
        if (!this.$v.selectIntervalo.$dirty) return errors
        !this.$v.selectIntervalo.required && errors.push('Intervalo is required')
        return errors
      },
      nameErrors () {
        const errors = []
       
        !this.$v.name_agenda.maxLength && errors.push('Name must be at most 10 characters long')
        !this.$v.name_agenda.required && errors.push('Name is required.')
        return errors
      }
   
    },

    methods: {
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
   
    dateFormat(xdate){
            return moment(xdate).format('DD-MM-YYYY');
        },
    timeFormat(xdate){
            return moment(xdate,'hh:mm').format('hh:mm');
        },
    makeSlots () {
             
            this.slots=[];
            this.xstart=this.start;
           
            this.xdatetime=[];

            //this.xdatetime=this.xdate+' '+this.xstart;
           // console.log(this.xdatetime);
             
            //this.xdatetime.push({date:this.xdate,start:this.xstart, status:'D'});
            //this.slots.push({dates:this.xdatetime,medico:this.selectMedico}); 
             this.dates.forEach((xdate) => {
              //  console.log(xdate);
             this.xdatetime.push({xdate,start:this.xstart, status:'D'});
               //Recorre  cada fecha y add el rango de slots/spacios habilitado 
                 do {
                   
                    this.xstart=moment(this.xstart,'hh:mm').add(this.selectIntervalo,'m').format('hh:mm');
                        
                    this.xdatetime.push({xdate,start:this.xstart, status:'D'});
                    
                    
                     //console.log(this.xdatetime);
                } while (moment(this.xstart,'hh:mm').format('hh:mm')<=moment(this.end,'hh:mm').format('hh:mm'));
              // console.log(this.xdatetime);
                this.slots.push({intervals:this.xdatetime,medico:this.selectMedico}); 
               
                  this.items.push({tab:xdate,content:this.xdatetime,medico:this.selectMedico,name_agenda:this.name_agenda,color:this.color});
                
                this.xstart=this.start;
                this.xdatetime=[];
                
            });
                console.log(this.slots);
                console.log(this.items);
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
                           
              this.itemsMedicos.push({name:x.name,id:x.id });
            });

           // datos.forEach( (i) => this.items.push( () => i  ) )

          //  console.log(this.items);
            
        } catch (error) {
            console.log(error);
        }        
      },
      submit () {
        this.$v.$touch()
      },
      clear () {
        this.$v.$reset()
        this.name_agenda = ''
        
        this.select = null
        this.checkbox = false
      },
    },
  }
</script>