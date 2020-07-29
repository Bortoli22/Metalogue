<template>
    <div>
      <b-card class="middark">
      <p class="card-text">Create a new custom mod for your dialogue</p>
      <b-form-input class="fspace" v-model="flag" placeholder="Enter flag..."></b-form-input>
      <b-form-input class="fspace" v-model="shorthand" placeholder="Enter flag shorthand (e.g. '-ts')..." v-on:keyup.enter="addMod()"></b-form-input>
      <b-button-group>
          <b-button v-on:click="addMod()" variant="info" size="sm">Add</b-button>
          <b-button v-on:click="close()" variant="danger" size="sm">Close</b-button>
      </b-button-group>
      <br>{{ error }}
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
      shorthand: '',
      protectedArgs: ['-o', '-rl', '-r', '-x', '-t', '-s', '-v', '-q', '-z']
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
        if (modCheck.flag === this.flag || modCheck.shorthand === this.shorthand) {
          this.error = 'Custom mod by that name or shorthand already exists'
          return
        }
      }
      if (this.flag === '' || this.shorthand === '') {
        this.error = 'Flag and shorthand fields must not be empty'
        return
      }
      if (this.protectedArgs.findIndex(pA => pA === this.shorthand) !== -1) {
        this.error = this.shorthand + ' is a protected shorthand and cannot be used'
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
    color: #f5f7fa;
  }
  .fspace {
    margin-bottom: 10px;
  }
</style>
