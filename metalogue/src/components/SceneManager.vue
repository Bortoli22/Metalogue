<template>
    <div>
        <b-list-group>
            <b-list-group-item>
                Scene Select
            </b-list-group-item>
            <b-list-group-item
                v-for="item in dialogueBank"
                v-bind:key="item.name">
                    {{ item.name }}
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'dialogueBank'
    ])
  }
}
</script>
