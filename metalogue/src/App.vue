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
            <b-nav-item>
              <router-link to="/getstore">Store Data</router-link>
            </b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown v-if="(activeUser.name !== '')" right>
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
    <b-container>
      <b-card
        title="One Moment"
        img-src="https://placekitten.com/1080/720"
        img-alt="Image"
        img-top
        class="mb-2 cardimg middark"
        v-if="loadingData"
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
      loadingData: false
    }
  },
  computed: {
    ...mapState([
      'activeUser'
    ])
  },
  methods: {
    ...mapActions([
      'changeUser',
      'fireLoad',
      'fireLoadOther'
    ]),
    async signOut () {
      if (auth.currentUser) {
        auth.signOut()
        this.changeUser({ name: '' })
        this.$router.replace({ path: '/login' })
      }
    },
    async getUser () {
      if (auth.currentUser) {
        const getName = await usersCollection.doc(auth.currentUser.uid).get()
        const toSend = getName.data().name
        this.changeUser({ name: toSend })
      }
    },
    async tryFetch () {
      try {
        this.loadingData = true
        var toLoad = await this.fetchData()
        this.fireLoad(toLoad)
        toLoad = await this.fetchOther()
        this.fireLoadOther(toLoad)
        this.loadingData = false
      } catch (err) {
        console.log(err)
        this.loadingData = false
      }
    },
    async fetchOther () {
      // get characters
      var cBank = []
      var fireCharacterBank = await usersCollection.doc(auth.currentUser.uid)
        .collection('characters').get()
      for (const character of fireCharacterBank.docs) {
        cBank.push({ spID: character.data().spID, spName: character.data().spName })
      }

      // get custom mods
      var cmBank = []
      var fireCustomModBank = await usersCollection.doc(auth.currentUser.uid)
        .collection('mods').get()
      for (const mod of fireCustomModBank.docs) {
        cmBank.push({ flag: mod.data().flag, shorthand: mod.data().shorthand })
      }

      return { cBank, cmBank }
    },
    async fetchData () {
      // set vuex store with data from firestore
      var pBank = []

      var fireProjectBank = await usersCollection.doc(auth.currentUser.uid)
        .collection('projects').get()
      for (const doc of fireProjectBank.docs) {
        // Obtain data for each project
        var sBank = []
        var fireSceneBank = await usersCollection.doc(auth.currentUser.uid)
          .collection('projects').doc(doc.id).collection('scenes').get()
        for (const doc2 of fireSceneBank.docs) {
          // Obtain data for each scene
          var dBank = []
          var fireDataBank = await usersCollection.doc(auth.currentUser.uid)
            .collection('projects').doc(doc.id).collection('scenes').doc(doc2.id).collection('data').get()
          for (const doc3 of fireDataBank.docs) {
            // Obtain data for each dialogue
            var mBank = []
            var fireModBank = await usersCollection.doc(auth.currentUser.uid)
              .collection('projects').doc(doc.id).collection('scenes').doc(doc2.id)
              .collection('data').doc(doc3.id).collection('mod').get()
            for (const doc4 of fireModBank.docs) {
              // Obtain mod data for each dialogue
              mBank.push({ flag: doc4.data().flag, args: doc4.data().args })
            }
            // push all mod data to dialogue
            dBank.push({ id: doc3.data().id, name: doc3.data().name, msg: doc3.data().msg, mod: mBank, parent: doc3.data().parent, nest: doc3.data().nest })
          }
          // push all dialogue data to scene
          sBank.push({ name: doc2.id, id: doc2.data().id, data: dBank })
        }
        // push all scene data to project
        pBank.push({ name: doc.id, id: doc.data().id, sceneBank: sBank })
      }
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
  color: #f5f7fa;
  background-color: #1F2933;
}

#nav {
  padding: 0px 0px 15px 0px;
}

#nav a {
  font-weight: bold;
  color: #f5f7fa;
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
  width: 50%;
  height: 50%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>

<style scoped>
  .middark {
    background-color: #3E4C59;
    color: #f5f7fa;
  }
</style>
