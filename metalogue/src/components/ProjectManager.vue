<template>
    <div>
        <b-list-group>
            <b-list-group-item>
                <strong>Project Select</strong>
            </b-list-group-item>
            <b-list-group-item
                v-for="item in projectBank"
                v-bind:key="item.id"
                v-bind:class="[{'active' : (item.id === activeProjectID ? true : false)},
                  {'hoverable' : (item.id === activeProjectID ? false : true)}]"
                v-on:click="swapProject({name: item.name, id: item.id})">
                    {{ item.name }}
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  created () {
    // after db integration move from dialogueBank set to basic template set

    if (this.projectBank.findIndex(element => element.id === this.activeProjectID) === -1) {
      // if the selected scene has been removed since last create
      if (this.projectBank.length > 0) {
        this.$emit('setActiveProject', this.projectBank[0].id)
      } else {
        this.$emit('setActiveProject', 'none')
      }
    }
  },
  computed: {
    ...mapState([
      'dialogueBank',
      'projectBank'
    ])
  },
  methods: {
    ...mapActions([
      'swapProject'
    ]),
    swapProject (newProject) {
      if (newProject.id !== this.activeProjectID) {
        this.swapProject({ old: this.activeProjectID, new: newProject.id, sceneID: this.activeSceneID })
        this.$emit('setActiveProject', newProject.id)
      }
    }
  },
  props: {
    activeProjectID: String,
    activeSceneID: String
  }
}
</script>

<style scoped>
  .hoverable:hover {
    cursor: pointer;
    background: #cecece
  }
</style>
