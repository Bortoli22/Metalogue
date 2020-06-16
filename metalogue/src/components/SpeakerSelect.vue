<template>
  <div>
    <b-dropdown v-bind:text="selectedCharacter">
      <b-dropdown-item-button
      v-for="character in characterBank"
      v-bind:key="character.spID"
      v-on:click="updateCharacter(character.spName)"
      > {{ character.spName }} </b-dropdown-item-button>
    </b-dropdown>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'characterBank'
    ])
  },
  data () {
    return {
      selectedCharacter: 'None'
    }
  },
  methods: {
    updateCharacter (name) {
      this.selectedCharacter = name
    }
  }
}
</script>
