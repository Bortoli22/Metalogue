<template>
    <div>
        <b-row>
            <b-button disabled>{{ name }}</b-button>
        </b-row>
        <b-row class="flags">
            <p>{{this.id}} ::</p>
            <p v-if="this.modProp.length === 1">Flag:  </p>
            <p v-if="this.modProp.length > 1">Flags:  </p>
            <p v-for="modifier in modProp" v-bind:key="modifier.flag">{{ modifier.flag }}, </p>
        </b-row>
    </div>
</template>

<script>
export default {
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
