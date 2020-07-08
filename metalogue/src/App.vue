<template>
  <div id="app">
    <div id="nav">
        <b-navbar toggleable="lg" type="dark" variant="info">
        <img src="@/assets/logo.png" length=2% width=2% class="navlogo">
        <b-navbar-brand href="#">Metalogue</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item>
              <router-link to="/">Home</router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link to="/getstore">Store Data</router-link>
            </b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item>
              <router-link to="/about">The Forbidden Feast</router-link>
            </b-nav-item>
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <em>{{ activeUser.name }}</em>
              </template>
              <b-dropdown-item href="#">Settings</b-dropdown-item>
              <b-dropdown-item v-on:click="signOut">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { auth } from './firebase'
import { mapActions, mapState } from 'vuex'

export default {
  created () {
    this.user = this.activeUser.name
  },
  computed: {
    ...mapState([
      'activeUser'
    ])
  },
  data () {
    return {
      user: ''
    }
  },
  methods: {
    ...mapActions([
      'changeUser'
    ]),
    async signOut () {
      if (auth.currentUser) {
        auth.signOut()
        this.changeUser({ name: 'User' })
        this.$router.replace({ name: 'login' })
      }
    }
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 0px 0px 30px 0px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #ddcad9;
}

.navlogo {
  padding-right: 10px
}
</style>
