<template>
    <div>
        <b-container>
            <b-jumbotron  header="Happy To Have You" lead="Create your Metalogue account below">
                <hr class="my-4">
                <b-form @submit.stop.prevent>
                    <label for="text-email">Email</label>
                    <b-input v-model="email" type="email" id="text-email" required></b-input>

                    <label for="text-password">Password</label>
                    <b-input v-model="password" type="password" id="text-password" required aria-describedby="password-help-block"></b-input>
                    <b-form-text id="password-help-block">
                    Your password should be more than 6 characters.
                    </b-form-text>

                    <label for="text-password2">Re-enter Password</label>
                    <b-input v-model="passwordConfirm" type="password" id="text-password2" required aria-describedby="password-help-block2"></b-input>
                    <b-form-text id="password-help-block2">
                    And they should match.
                    </b-form-text>

                    <br>
                    <b-button v-on:click="tryRegister">Register</b-button>
                    <br>
                    {{ rError }}
                </b-form>
                Have an account already?
                <router-link to="/login">Login</router-link>
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
      password: '',
      passwordConfirm: '',
      rError: ''
    }
  },
  methods: {
    ...mapActions([
      'changeUser',
      'registered'
    ]),
    async tryRegister () {
      if (this.password !== this.passwordConfirm) {
        this.rError = 'Passwords must match'
      } else if (this.password.length < 6) {
        this.rError = 'Password must be more than 6 characters'
      } else {
        try {
          const user = await fire.auth.createUserWithEmailAndPassword(this.email, this.password)
          console.log(user)
          await fire.usersCollection.doc(fire.auth.currentUser.uid).set({ name: this.email, debug: false, cat: false })
          await fire.usersCollection.doc(fire.auth.currentUser.uid).collection('characters').doc('All').set({ characters: { spName: 'None', spID: '00000' } })
          this.changeUser({ name: this.email })
          this.registered({ spID: '00000', spName: 'None' })
          this.$router.replace({ name: 'About' })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}
</script>
