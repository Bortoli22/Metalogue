<template>
    <div>
      <b-card class="middark">
      <p class="card-text">Create a new project
      </p>
      <b-form-input v-model="newProject" placeholder="Project Name..." v-on:keyup.enter="createProject()"></b-form-input>
      <b-button-group id="actionbtn">
          <b-button v-on:click="createProject()" variant="info" size="sm">Add</b-button>
          <b-button v-on:click="close()" variant="danger" size="sm">Close</b-button>
      </b-button-group>
      {{ error }}
      </b-card>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import * as fire from '../firebase'

export default {
  computed: {
    ...mapState([
      'projectBank'
    ])
  },
  data () {
    return {
      newProject: '',
      error: ''
    }
  },
  methods: {
    ...mapActions([
      'addProject'
    ]),
    close () {
      this.$emit('close', null)
    },
    async createProject () {
      const id = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      var toSend = {
        projectName: this.newProject,
        projectID: id,
        characterBank: [
          {
            spID: 'sU8k9',
            spName: 'Player'
          },
          {
            spID: '00000',
            spName: 'None'
          }
        ]
      }
      var element
      for (element of this.projectBank) {
        if (element.name === this.newProject) {
          this.error = 'Name already used'
          return
        }
      }
      this.error = ''
      if (this.projectBank.length === 0) {
        this.$emit('setActiveProjectID', id)
        await fire.usersCollection.doc(fire.auth.currentUser.uid)
          .update({ currentProject: this.newProject, currentProjectID: id })
      }
      await fire.usersCollection.doc(fire.auth.currentUser.uid).collection('projects').doc(this.newProject).set({
        name: this.newProject,
        id: id,
        characterBank: [
          {
            spID: 'sU8k9',
            spName: 'Player'
          },
          {
            spID: '00000',
            spName: 'None'
          }
        ]
      })
      this.addProject(toSend)
      await fire.usersCollection.doc(fire.auth.currentUser.uid).update({
        projects: this.projectBank
      })
      this.newProject = ''
      this.$emit('created', null)
    }
  }
}
</script>

<style scoped>
  .middark {
    background-color: #3E4C59;
    color: #f5f7fa;
  }
  #actionbtn {
    margin-top: 10px
  }
</style>
