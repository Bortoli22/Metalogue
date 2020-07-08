<template>
    <div>
        Register
        <b-form @submit.stop.prevent>
            <label for="text-email">Email</label>
            <b-input v-model="email" type="email" id="text-email" required></b-input>

            <label for="text-password">Password</label>
            <b-input v-model="password" type="password" id="text-password" required aria-describedby="password-help-block"></b-input>
            <b-form-text id="password-help-block">
            Your password should be strong.
            </b-form-text>

            <label for="text-password2">Re-enter Password</label>
            <b-input v-model="passwordConfirm" type="password" id="text-password2" required aria-describedby="password-help-block2"></b-input>
            <b-form-text id="password-help-block2">
            And they should match.
            </b-form-text>

            <b-button v-on:click="tryRegister">Register</b-button>
            {{ rError }}
        </b-form>
        Have an account already?
        <router-link to="/login">Login</router-link>
    </div>
</template>

<script>
import { auth } from '../firebase'

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
    async tryRegister () {
      if (this.password !== this.passwordConfirm) {
        this.rError = 'Passwords must match'
      } else {
        try {
          const user = auth.createUserWithEmailAndPassword(this.email, this.password)
          console.log(user)
          this.$router.replace({ name: 'About' })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}
</script>
