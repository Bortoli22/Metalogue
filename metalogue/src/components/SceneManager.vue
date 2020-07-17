<template>
    <div>
        <b-list-group>
            <b-list-group-item class="title">
                <strong>Scene Select</strong>
            </b-list-group-item>
            <b-list-group-item
                v-for="item in dialogueBank"
                v-bind:key="item.id"
                v-bind:class="[{'activated' : (item.id === activeSceneID ? true : false)},
                  {'hoverable' : (item.id === activeSceneID ? false : true)}]"
                v-on:click="swapAction({name: item.name, id: item.id})">
                    {{ item.name }}
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  created () {
    if (this.dialogueBank.findIndex(element => element.id === this.activeSceneID) === -1) {
      // if the selected scene has been removed since last create
      if (this.dialogueBank.length > 0) {
        this.$emit('setActiveScene', this.dialogueBank[0].id)
      } else {
        this.$emit('setActiveScene', 'none')
      }
    }
  },
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

<style scoped>
  .activated {
    background: #b085f5
  }
  .title, .hoverable {
    background: #3e4c59
  }
  .activated, .title, .hoverable {
    color: #f5f7fa;
  }
  .hoverable:hover {
    cursor: pointer;
    background: #323f4b
  }
</style>
