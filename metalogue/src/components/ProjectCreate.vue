<template>
    <div>
        <b-button v-b-toggle.projectCreate variant="info"> {{ mainButtonText }} </b-button>
        <b-collapse id="projectCreate" class="mt-2" v-on:show="swapMainButtonText('Collapse')" v-on:hide="swapMainButtonText('New Project')">
            <b-card>
            <p class="card-text">Create a new project
            </p>
            <b-form-input v-model="newProject" placeholder="Project Name..." v-on:keyup.enter="createProject()"></b-form-input>
            <b-button-group>
                <b-button v-b-toggle.projectCreate v-on:click="createProject()" variant="info" size="sm">Add</b-button>
                <b-button v-b-toggle.projectCreate variant="danger" size="sm">Close</b-button>
            </b-button-group>
            </b-card>
        </b-collapse>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      mainButtonText: 'New Project',
      newProject: ''
    }
  },
  methods: {
    ...mapActions([
      'addProject'
    ]),
    createProject () {
      const id = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      var toSend = { projectName: this.newProject, projectID: id }
      this.addProject(toSend)
      this.newProject = ''
    },
    swapMainButtonText (newText) {
      this.mainButtonText = newText
    }
  }
}
</script>
