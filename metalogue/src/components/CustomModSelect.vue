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
    > {{ mod.flag }}</b-dropdown-item-button>
    </b-dropdown>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'customMod'
    ])
  },
  methods: {
    clickedMod (m) {
      this.$emit('clickedCustom', m)
    }
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
