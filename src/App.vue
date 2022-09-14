<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Aranto"
          class="shrink mr-2"
          contain
          :src="require('./assets/logo.png')"
          transition="scale-transition"
          width="40"
        />
          <span class="shrink mt-1 hidden-sm-and-down" >Aranto - Sistema Integral para Sanatorios</span>
        
        
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="/"
        target="_blank"
        text
      >
        <span class="mr-2">Invitado</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
       
      <router-view/>
    </v-main>
  </v-app>
</template>


