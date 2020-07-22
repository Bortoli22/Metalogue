<template>
  <div id="app">
    <div id="nav">
        <b-navbar id="navbar" toggleable="lg">
        <img src="@/assets/path53.png" length=3% width=3% class="navlogo">
        <b-navbar-brand href="#">Metalogue</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item>
              <router-link to="/">Home</router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link to="/about">About</router-link>
            </b-nav-item>
            <b-nav-item v-if="settings.debug">
              <router-link to="/getstore">Vuex_Store_Data</router-link>
            </b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown v-if="(activeUser.name !== '')" right>
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <em>{{ activeUser.name }}</em>
              </template>
              <div id="dropdowns">
              <b-dropdown-item v-on:click="toSettings">Settings</b-dropdown-item>
              <b-dropdown-item v-on:click="signOut">Sign Out</b-dropdown-item>
              </div>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <b-container>
      <b-card
        title="One Moment"
        img-src="@/assets/cats/cat03.png"
        img-alt="Hold Tight"
        img-top
        class="cardimg middark"
        v-if="loadingData && settings.cat && resolvedSettings"
      >
        <b-card-text>
          <b-spinner small></b-spinner>
          Getting your dialogue ready...
        </b-card-text>
      </b-card>
      <b-card
        title="One Moment"
        img-src="@/assets/path53.png"
        img-alt="Hold Tight"
        img-top
        class="cardimg middark"
        v-if="loadingData && !settings.cat && resolvedSettings"
      >
        <b-card-text>
          <b-spinner small></b-spinner>
          Getting your dialogue ready...
        </b-card-text>
      </b-card>
    </b-container>
      <router-view
        v-if="!loadingData"/>
  </div>
</template>

<script>
import { auth, usersCollection } from './firebase'
import { mapActions, mapState } from 'vuex'

export default {
  created () {
    this.getUser()
    this.tryFetch()
  },
  data () {
    return {
      loadingData: false,
      resolvedSettings: false
    }
  },
  computed: {
    ...mapState([
      'activeUser',
      'settings'
    ])
  },
  methods: {
    ...mapActions([
      'changeUser',
      'fireLoad',
      'fireLoadOther'
    ]),
    toSettings () {
      this.$router.replace({ path: '/settings' })
    },
    async signOut () {
      if (auth.currentUser) {
        auth.signOut()
        this.changeUser({ name: '', currentProjectID: 'none' })
        this.$router.replace({ path: '/login' })
      }
    },
    async getUser () {
      if (auth.currentUser) {
        const getName = await usersCollection.doc(auth.currentUser.uid).get()
        const toSend = { name: getName.data().name, currentProjectID: getName.data().currentProjectID }
        this.changeUser(toSend)
      }
    },
    async tryFetch () {
      if (auth.currentUser) {
        try {
          this.loadingData = true
          var toLoad = await this.fetchOther()
          this.fireLoadOther(toLoad)
          this.resolvedSettings = true
          toLoad = await this.fetchData()
          this.fireLoad(toLoad)
          this.loadingData = false
          this.resolvedSettings = false
        } catch (err) {
          console.log(err)
          this.loadingData = false
          this.resolvedSettings = false
        }
      }
    },
    async fetchOther () {
      // get characters
      var fireCharacterBank = await usersCollection.doc(auth.currentUser.uid)
        .collection('characters').doc('All').get()
      var cBank = fireCharacterBank.data().characters

      // get custom mods
      var fireCustomModBank = await usersCollection.doc(auth.currentUser.uid)
        .collection('mods').doc('All').get()
      var cmBank = fireCustomModBank.data().mods

      // get settings
      var fireSettings = await usersCollection.doc(auth.currentUser.uid).get()
      var settings = fireSettings.data()

      // get projectBank
      var fireProjects = await usersCollection.doc(auth.currentUser.uid).get()
      var pBank = fireProjects.data().projects

      return { cBank, cmBank, settings, pBank }
    },
    async fetchData () {
      // set vuex store with data from firestore
      var getProject = await usersCollection.doc(auth.currentUser.uid).get()
      try {
        var currentProject = { name: getProject.data().currentProject, id: getProject.data().currentProjectID }
        var fireSceneBank = await usersCollection.doc(auth.currentUser.uid)
          .collection('projects').doc(currentProject.name).collection('scenes').get()
      } catch (err) {
        console.log(err)
        console.log('No Default')
        return []
      }
      var sBank = []
      for (const doc2 of fireSceneBank.docs) {
        // Obtain data for each scene
        sBank.push(doc2.data())
      }
      var pBank = [{ name: currentProject.name, id: currentProject.id, sceneBank: sBank }]
      return pBank
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
}

#nav {
  padding: 0px 0px 15px 0px;
}

#nav a {
  font-weight: bold;
  color: #f5f7fa;
}

#app .dropdown-item {
  color: #000000
}

#app .btn {
  background: #b085f5;
  color: #f5f7fa;
  border-color: #b085f5;
}

#app .dropdown-item:hover,
#app .dropdown-item:focus {
  color: #f5f7fa;
  background-color: #b085f5;
}

#navbar {
  background-color: #3e4c59;
}

#nav a.router-link-exact-active {
  color: #b085f5;
}

.navlogo {
  padding-right: 10px
}

.cardimg {
  width: 25%;
  height: 25%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 25px;
  color: #f5f7fa;
}
</style>

<style scoped>
  .middark {
    background-color: #3E4C59;
    color: #f5f7fa;
  }
</style>
