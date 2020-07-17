<template>
    <div>
      <b-card class="middark">
      <p class="card-text">Create a new custom mod for your dialogue</p>
      <b-form-input class="fspace" v-model="flag" placeholder="Enter flag..."></b-form-input>
      <b-form-input class="fspace" v-model="shorthand" placeholder="Enter flag shorthand (e.g. '-t')..." v-on:keyup.enter="addMod()"></b-form-input>
      <b-button-group>
          <b-button v-on:click="addMod()" variant="info" size="sm">Add</b-button>
          <b-button v-on:click="close()" variant="danger" size="sm">Close</b-button>
      </b-button-group>
      {{ error }}
      </b-card>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'customMod'
    ])
  },
  data () {
    return {
      flag: '',
      argRaw: '',
      args: [],
      error: '',
      shorthand: ''
    }
  },
  methods: {
    ...mapActions([
      'addCMod'
    ]),
    addMod () {
      this.args = this.argRaw.split()
      var toSend = { flag: this.flag, args: this.args, shorthand: this.shorthand }
      var modCheck
      for (modCheck of this.customMod) {
        if (modCheck.flag === this.flag) {
          this.error = 'Custom mod by that already exists'
          return
        }
      }
      if (this.flag === '' || this.shorthand === '') {
        this.error = 'Flag and shorthand fields must not be empty'
        return
      }
      this.error = ''
      this.addCMod(toSend)
      this.argRaw = ''
      this.shorthand = ''
      this.flag = ''
      this.args = []
      this.$emit('created', null)
    },
    close () {
      this.$emit('close', null)
    }
  }
}
</script>

<style scoped>
  .middark {
    background-color: #3E4C59;
  }
  .fspace {
    margin-bottom: 5px;
  }
</style>
