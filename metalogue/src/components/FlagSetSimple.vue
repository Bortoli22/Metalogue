<template>
    <div>
        <b-row>
            <button type="button" class="btn btn-info" disabled>{{ name }}</button>
        </b-row>
        <b-row class="flags">
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
    }
</style>
