<template>
    <div>
      <b-container>
      <b-jumbotron header="Welcome" lead="Hello! Log in to your Metalogue account below">
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
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    ...mapActions([
      'changeUser'
    ]),
    async tryLogin () {
      try {
        await fire.auth.signInWithEmailAndPassword(this.email, this.password)
        const getName = await fire.usersCollection.doc(fire.auth.currentUser.uid).get()
        const toSend = getName.data().name
        this.changeUser({ name: toSend })
        // TO-DO: use action/mutator to set vuex store with data from user
        this.$router.replace({ name: 'Home' })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
