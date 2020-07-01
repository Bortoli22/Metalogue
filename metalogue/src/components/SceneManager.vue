<template>
    <div>
        <b-list-group>
            <b-list-group-item>
                Scene Select
            </b-list-group-item>
            <b-list-group-item
                v-for="item in dialogueBank"
                v-bind:key="item.name"
                v-on:click="swapAction(item.name)">
                    {{ item.name }}
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState([
      'dialogueBank'
    ])
  },
  methods: {
    ...mapActions([
      'swapBank'
    ]),
    swapAction (newScene) {
      if (newScene !== this.activeScene) {
        this.swapBank({ old: this.activeScene, new: newScene })
        this.$emit('setActiveScene', newScene)
      }
    }
  },
  props: {
    activeScene: String
  }
}
</script>
