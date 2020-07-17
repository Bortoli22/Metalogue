<template>
  <div>
    <b-dropdown text="Custom Mod">
        <b-dropdown-item-button v-if="customMod.length === 0">
        No Custom Mods Created
        </b-dropdown-item-button>
        <b-dropdown-item-button
        v-for="mod in customMod"
        v-bind:key="mod.flag"
        v-on:click="clickedMod(mod)"
        > {{ mod.flag }} </b-dropdown-item-button>
    </b-dropdown>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState([
      'customMod'
    ])
  },
  data () {
    return {
      payload: {},
      selections: []
    }
  },
  methods: {
    ...mapActions([
      'addCModToDC',
      'remCModFromDC'
    ]),
    pack () {
      this.payload = {
        mod: this.mod
      }
    },
    clickedMod (m) {
      const modFound = this.mod.findIndex(e => e.flag === m.flag)
      if (modFound > -1) {
        this.remCModFromDC({ id: this.activeContainerID, mod: m })
      } else {
        this.addCModToDC({ id: this.activeContainerID, mod: m })
      }
    }
  },
  props: {
    mod: Array,
    activeContainerID: String
  }
}
</script>

<style scoped>
  .btn-secondary, .btn-secondary:hover,
  .btn-secondary:focus {
    background: #b085f5;
    color: #f5f7fa;
    border-color: #b085f5;
  }
</style>
