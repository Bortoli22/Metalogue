<template>
    <div>
      <b-card>
      <p class="card-text">Create a new speaker to take part in the dialogue</p>
      <b-form-input v-model="newSpeaker" placeholder="Enter Name..." v-on:keyup.enter="addCharacter()"></b-form-input>
      <b-button-group>
          <b-button v-on:click="addCharacter()" variant="info" size="sm">Add</b-button>
          <b-button variant="danger" size="sm">Close</b-button>
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
      'characterBank'
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
      var toSend = { spID: id, spName: this.newSpeaker }
      var charCheck
      for (charCheck of this.characterBank) {
        if (charCheck.spName === this.newSpeaker) {
          this.error = 'Speaker already exists'
          return
        }
      }
      this.error = ''
      this.addSpeaker(toSend)
      this.newSpeaker = ''
      this.$emit('created', null)
    }
  }
}
</script>
