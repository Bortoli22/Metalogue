<template>
    <div>
      <b-container>
      <b-card
        title="Logging In"
        img-src="@/assets/cats/cat04.png"
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
        title="Logging In"
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
      <b-jumbotron v-if="!loadingData" header="Welcome" lead="Hello! Log in to your Metalogue account below">
        <hr class="my-4">
        <b-form @submit.stop.prevent>
                <label for="text-email">Email</label>
                <b-input v-model="email" type="email" id="text-email" required></b-input>

                <label for="text-password">Password</label>
                <b-input v-model="password" type="password" id="text-password" required></b-input>

                <br>
                <b-button v-on:click="tryLogin">Login</b-button>
            </b-form>
            New to Metalogue?
            <router-link to="/register">Register</router-link>
      </b-jumbotron>
      </b-container>
    </div>
</template>

<script>
import * as fire from '../firebase'
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'settings'
    ])
  },
  data () {
    return {
      email: '',
      password: '',
      loadingData: false,
      resolvedSettings: false
    }
  },
  methods: {
    ...mapActions([
      'changeUser',
      'fireLoad',
      'fireLoadOther'
    ]),
    async tryLogin () {
      try {
        await fire.auth.signInWithEmailAndPassword(this.email, this.password)
        const getName = await fire.usersCollection.doc(fire.auth.currentUser.uid).get()
        const toSend = { name: getName.data().name, currentProjectID: getName.data().currentProjectID }
        this.changeUser(toSend)
        this.loadingData = true
        var toLoad = await this.fetchOther()
        this.fireLoadOther(toLoad)
        this.resolvedSettings = true
        toLoad = await this.fetchData()
        this.fireLoad(toLoad)
        this.$router.replace({ path: '/' })
      } catch (err) {
        console.log(err)
        this.loadingData = false
        this.resolvedSettings = false
      }
    },
    async fetchOther () {
      // get characters
      var fireCharacterBank = await fire.usersCollection.doc(fire.auth.currentUser.uid)
        .collection('characters').doc('All').get()
      var cBank = fireCharacterBank.data().characters

      // get custom mods
      var fireCustomModBank = await fire.usersCollection.doc(fire.auth.currentUser.uid)
        .collection('mods').doc('All').get()
      var cmBank = fireCustomModBank.data().mods

      // get settings
      var fireSettings = await fire.usersCollection.doc(fire.auth.currentUser.uid).get()
      var settings = fireSettings.data()

      // get projectBank
      var fireProjects = await fire.usersCollection.doc(fire.auth.currentUser.uid).get()
      var pBank = fireProjects.data().projects

      return { cBank, cmBank, settings, pBank }
    },
    async fetchData () {
      // set vuex store with data from firestore
      var getProject = await fire.usersCollection.doc(fire.auth.currentUser.uid).get()
      try {
        var currentProject = { name: getProject.data().currentProject, id: getProject.data().currentProjectID }
        var fireSceneBank = await fire.usersCollection.doc(fire.auth.currentUser.uid)
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

<style scoped>
  .middark {
    background-color: #3E4C59;
  }
  .cardimg {
    width: 50%;
    height: 50%;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
</style>
