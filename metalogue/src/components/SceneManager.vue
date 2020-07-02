<template>
    <div>
        <b-list-group>
            <b-list-group-item>
                <strong>Scene Select</strong>
            </b-list-group-item>
            <b-list-group-item
                v-for="item in dialogueBank"
                v-bind:key="item.name"
                v-on:click="swapAction({name: item.name, id: item.id})">
                    {{ item.name }}
                    <b-button size="sm" variant="danger"> : </b-button>
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
      if (newScene.id !== this.activeSceneID) {
        this.swapBank({ old: this.activeSceneID, new: newScene.id })
        this.$emit('setActiveScene', newScene.id)
      }
    }
  },
  props: {
    activeSceneID: String
  }
}
</script>
