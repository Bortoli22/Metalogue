<template>
    <div>
        Login
        <b-form @submit.stop.prevent>
            <label for="text-email">Email</label>
            <b-input v-model="email" type="email" id="text-email" required></b-input>

            <label for="text-password">Password</label>
            <b-input v-model="password" type="password" id="text-password" required aria-describedby="password-help-block"></b-input>
            <b-form-text id="password-help-block">
            Your password should be strong.
            </b-form-text>

            <b-button v-on:click="tryLogin">Login</b-button>
        </b-form>
        New to Metalogue?
        <router-link to="/register">Register</router-link>
    </div>
</template>

<script>
import { auth } from '../firebase'

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async tryLogin () {
      try {
        const user = await auth.signInWithEmailAndPassword(this.email, this.password)
        console.log('Signing in:')
        console.log(user)
        this.$router.replace({ name: 'Home' })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
