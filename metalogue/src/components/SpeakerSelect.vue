<template>
  <div>
    <b-dropdown variant="info" split v-on:click="cycleCharacter()" v-bind:text="selectedCharacter">
      <b-dropdown-item-button
      v-for="character in characterBank"
      v-bind:key="character.spID"
      v-on:click="updateCharacter(character.spName)"
      > {{ character.spName }} </b-dropdown-item-button>
    </b-dropdown>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState([
      'characterBank'
    ])
  },
  created () {
    this.selectedCharacter = this.name
  },
  data () {
    return {
      selectedCharacter: 'None',
      payload: {}
    }
  },
  methods: {
    ...mapActions([
      'modSpeaker'
    ]),
    cycleCharacter () {
      const cIndex = this.characterBank.findIndex(speaker => speaker.spName === this.selectedCharacter)
      if (!(cIndex === this.characterBank.length - 1)) {
        this.updateCharacter(this.characterBank[cIndex + 1].spName)
      } else {
        this.updateCharacter(this.characterBank[0].spName)
      }
    },
    pack () {
      this.payload = {
        id: this.id,
        name: this.selectedCharacter
      }
    },
    updateCharacter (name) {
      this.selectedCharacter = name
      this.modSpeaker({ id: this.id, name: this.selectedCharacter })
      this.pack()
      this.$emit('propUpdate', this.payload)
    }
  },
  props: {
    id: String,
    name: String
  }
}
</script>
