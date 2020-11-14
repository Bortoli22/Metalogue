<template>
    <div>
      <b-card class="middark">
      <p class="card-text">Create a new speaker to take part in the dialogue</p>
      <b-form-input v-model="newSpeaker" placeholder="Enter Name..." v-on:keyup.enter="addCharacter()"></b-form-input>
      <b-button-group id="actionbtn">
          <b-button v-on:click="addCharacter()" variant="info" size="sm">Add</b-button>
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
      'projectBank'
    ])
  },
  data () {
    return {
      newSpeaker: '',
      error: ''
    }
  },
  methods: {
    ...mapActions([
      'addSpeaker'
    ]),
    addCharacter () {
      const id = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      var toSend = { spID: id, spName: this.newSpeaker, pID: this.activeProjectID }
      var charCheck
      const toModIndex = this.projectBank.findIndex(element => element.id === this.activeProjectID)
      if (toModIndex > -1) {
        for (charCheck of this.projectBank[toModIndex].characterBank) {
          if (charCheck.spName === this.newSpeaker) {
            this.error = 'Speaker already exists'
            return
          }
        }
      }
      this.error = ''
      this.addSpeaker(toSend)
      this.newSpeaker = ''
      this.$emit('created', null)
    },
    close () {
      this.$emit('close', null)
    }
  },
  props: {
    activeProjectID: String
  }
}
</script>

<style scoped>
  .middark {
    background-color: #3E4C59;
    color: #f5f7fa;
  }
  #actionbtn {
    margin-top: 10px
  }
</style>
