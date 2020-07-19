<template>
    <div>
        <b-row>
            <b-button block disabled>{{ name.substring(0, 10) }}</b-button>
        </b-row>
        <b-row class="flags">
            <p v-if="settings.debug">{{this.id}} ::</p>
            <p v-if="!settings.debug"><br></p>
            <p v-for="modifier in modProp" v-bind:key="modifier.flag">{{ modifier.flag }}, </p>
        </b-row>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'settings'
    ])
  },
  props: {
    id: String,
    name: String,
    modProp: Array
  }
}
</script>

<style scoped>
    .flags {
        font-size: 80%;
        color: #f5f7fa
    }
      .btn-secondary, .btn-secondary:hover,
  .btn-secondary:focus {
    background: #b085f5  !important;
    color: #f5f7fa;
    border-color: #b085f5;
  }
</style>
