<template>
    <div>
      <b-card>
      <p class="card-text">Create a new project
      </p>
      <b-form-input v-model="newProject" placeholder="Project Name..." v-on:keyup.enter="createProject()"></b-form-input>
      <b-button-group>
          <b-button v-on:click="createProject()" variant="info" size="sm">Add</b-button>
          <b-button v-on:click="close()" variant="danger" size="sm">Close</b-button>
      </b-button-group>
      {{ error }}
      </b-card>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

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
    createProject () {
      const id = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      var toSend = { projectName: this.newProject, projectID: id }
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
      }
      this.addProject(toSend)
      this.newProject = ''
      this.$emit('created', null)
    }
  }
}
</script>
