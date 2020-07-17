<template>
    <div>
        <b-list-group>
            <b-list-group-item class="title">
                <strong>Project Select</strong>
            </b-list-group-item>
            <b-list-group-item
                v-for="item in projectBank"
                v-bind:key="item.id"
                v-bind:class="[{'activated' : (item.id === activeProjectID ? true : false)},
                  {'hoverable' : (item.id === activeProjectID ? false : true)}]"
                v-on:click="swap({name: item.name, id: item.id})">
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
        this.$emit('setActiveProjectID', this.projectBank[0].id)
      } else {
        this.$emit('setActiveProjectID', 'none')
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
    swap (newProject) {
      if (newProject.id !== this.activeProjectID) {
        this.swapProject({ old: this.activeProjectID, new: newProject.id, sceneID: this.activeSceneID })
        this.$emit('setActiveProjectID', newProject.id)
        if (this.dialogueBank.length > 0) {
          this.$emit('setActiveScene', this.dialogueBank[0].id)
        }
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
