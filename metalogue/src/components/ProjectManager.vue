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
      'swapProject',
      'projectSync'
    ]),
    async swap (newProject) {
      if (newProject.id !== this.activeProjectID) {
        // push project WILL BOOST READ/WRITE, COMMENT OUT IF REACHING LIMIT
        this.projectSync({ project: this.activeProjectID, scene: this.activeSceneID })
        var p = this.projectBank.find(element => element.id === this.activeProjectID)
        try {
          await fire.usersCollection.doc(fire.auth.currentUser.uid).collection('projects').doc(p.name).set({
            name: p.name,
            id: p.id,
            characterBank: p.characterBank
          })
          // push project array
          await fire.usersCollection.doc(fire.auth.currentUser.uid).update({
            projects: this.projectBank
          })
          // push scene data
          var s = this.dialogueBank.find(element => element.id === this.activeSceneID)
          if (s !== undefined) {
            await fire.usersCollection.doc(fire.auth.currentUser.uid).collection('projects').doc(p.name).collection('scenes').doc(s.name).set({
              name: s.name,
              id: s.id,
              data: s.data
            })
          }
        } catch (err) {
          console.log(err)
        }

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
        // pull charBank
        var getProject = await fire.usersCollection.doc(fire.auth.currentUser.uid).get()
        var getChar = await fire.usersCollection.doc(fire.auth.currentUser.uid).collection('projects').doc(getProject.data().currentProject).get()
        var charToSend = getChar.data().characterBank
        this.swapProject({ sBank: sBank, pID: newProject.id, characterBank: charToSend })
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
