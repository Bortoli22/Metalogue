<template>
  <div class="debug">
    <b-jumbotron>
        <template v-slot:header>Store Components</template>
        <template v-slot:lead>View the current state of 'dialogueData' in Vuex</template>

        <hr class="my-4">
        <p align="left" v-for="element in dialogueData"
        v-bind:key="element.id">
            id: {{element.id}} <br>
            name: {{element.name}} <br>
            msg: {{element.msg}} <br>
            mod: {{element.mod}} <br>
            parent: {{element.parent}} <br>
            nest: {{element.nest}} <br>
            ----------------------------------------------------------
        </p>
    </b-jumbotron>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'dialogueData'
    ])
  }
}
</script>
