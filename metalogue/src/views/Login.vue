<template>
    <div>
      <b-container>
      <b-card
        title="Logging in"
        img-src="https://placekitten.com/800/500"
        img-alt="Image"
        img-top
        class="mb-2 middark"
        v-if="loadingData"
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
      'projectBank'
    ])
  },
  data () {
    return {
      email: '',
      password: '',
      loadingData: false
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
        const toSend = getName.data().name
        this.changeUser({ name: toSend })
        this.loadingData = true
        var toLoad = await this.fetchData()
        this.fireLoad(toLoad)
        toLoad = await this.fetchOther()
        this.fireLoadOther(toLoad)
        this.$router.replace({ path: '/' })
      } catch (err) {
        console.log(err)
        this.loadingData = false
      }
    },
    async fetchOther () {
      // get characters
      var cBank = []
      var fireCharacterBank = await fire.usersCollection.doc(fire.auth.currentUser.uid)
        .collection('characters').get()
      for (const character of fireCharacterBank.docs) {
        cBank.push({ spID: character.data().spID, spName: character.data().spName })
      }

      // get custom mods
      var cmBank = []
      var fireCustomModBank = await fire.usersCollection.doc(fire.auth.currentUser.uid)
        .collection('mods').get()
      for (const mod of fireCustomModBank.docs) {
        cmBank.push({ flag: mod.data().flag, shorthand: mod.data().shorthand })
      }

      return { cBank, cmBank }
    },
    async fetchData () {
      // set vuex store with data from firestore

      // get projects
      var pBank = []
      var fireProjectBank = await fire.usersCollection.doc(fire.auth.currentUser.uid)
        .collection('projects').get()
      for (const doc of fireProjectBank.docs) {
        // Obtain data for each project
        var sBank = []
        var fireSceneBank = await fire.usersCollection.doc(fire.auth.currentUser.uid)
          .collection('projects').doc(doc.id).collection('scenes').get()
        for (const doc2 of fireSceneBank.docs) {
          // Obtain data for each scene
          var dBank = []
          var fireDataBank = await fire.usersCollection.doc(fire.auth.currentUser.uid)
            .collection('projects').doc(doc.id).collection('scenes').doc(doc2.id).collection('data').get()
          for (const doc3 of fireDataBank.docs) {
            // Obtain data for each dialogue
            var mBank = []
            var fireModBank = await fire.usersCollection.doc(fire.auth.currentUser.uid)
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

<style scoped>
  .middark {
    background-color: #3E4C59;
  }
</style>
