<template>
    <div>
        <b-list-group class="table">
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
import * as fire from '../firebase'

export default {
  created () {
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
    async swap (newProject) {
      if (newProject.id !== this.activeProjectID) {
        // pull new project data and set to dialogueBank
        try {
          // set settings for last worked dialogue
          await fire.usersCollection.doc(fire.auth.currentUser.uid)
            .update({ currentProject: newProject.name, currentProjectID: newProject.id })
          // get scene collection
          var fireSceneBank = await fire.usersCollection.doc(fire.auth.currentUser.uid)
            .collection('projects').doc(newProject.name).collection('scenes').get()
        } catch (err) {
          console.log(err)
          return
        }
        var sBank = []
        for (const doc2 of fireSceneBank.docs) {
        // Obtain data for each scene
          sBank.push(doc2.data())
        }
        this.swapProject({ sBank: sBank })
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
  .table {
    padding-bottom: 15px;
  }
</style>
