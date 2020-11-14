<template>
  <div class="home">
    <b-container fluid>
      <b-row class="toolrow">
        <Toolbar
        @setActiveSceneID="setActiveScene"
        @setActiveProjectID="setActiveProjectID"
        v-bind:activeSceneID="activeSceneID"
        v-bind:activeProjectID="activeProjectID"/>
      </b-row>
      <hr/>
      <b-row>
        <b-col class="col-md-auto">
          <ProjectManager
          v-bind:activeProjectID="activeProjectID"
          v-bind:activeSceneID="activeSceneID"
          @setActiveProjectID="setActiveProjectID"
          @setActiveScene="setActiveScene"
          />
          <SceneManager
          v-bind:activeSceneID="activeSceneID"
          @setActiveScene="setActiveScene"
          />
        </b-col>
        <b-col>
          <ProjectInitiator
          v-if="projectBank.length === 0"/>
          <SceneInitiator
          v-if="dialogueBank.length === 0 && projectBank.length > 0"/>
          <DialogueInitiator
          v-if="(dialogueData.length === 0) && (dialogueBank.length > 0)"
          v-bind:activeSceneID="activeSceneID"
          v-bind:activeProjectID="activeProjectID"/>
          <DialogueContainer
          v-for="val in dialogueData"
          v-bind:key="val.id+val.nest+val.importKey"
          v-bind:msg="val.msg"
          v-bind:id="val.id"
          v-bind:name="val.name"
          v-bind:modProp="val.mod"
          v-bind:nestProp="val.nest"
          v-bind:parentProp="val.parent"
          v-bind:importKey="val.importKey"
          v-bind:activeContainerID="activeContainerID"
          v-bind:activeProjectID="activeProjectID"
          v-bind:activeSceneID="activeSceneID"
          @setActiveContainerID="setActiveContainerID"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import DialogueContainer from '@/components/DialogueContainer.vue'
import Toolbar from '@/components/Toolbar.vue'

import SceneManager from '@/components/SceneManager.vue'

import DialogueInitiator from '@/components/DialogueInitiator.vue'
import SceneInitiator from '@/components/SceneInitiator.vue'
import ProjectInitiator from '@/components/ProjectInitiator.vue'

import ProjectManager from '@/components/ProjectManager.vue'

import { mapState } from 'vuex'

export default {
  name: 'Home',
  created () {
    this.activeProjectID = this.activeUser.currentProjectID
  },
  components: {
    DialogueContainer,
    SceneManager,
    DialogueInitiator,
    SceneInitiator,
    ProjectManager,
    ProjectInitiator,
    Toolbar
  },
  computed: {
    ...mapState([
      'dialogueData',
      'dialogueBank',
      'projectBank',
      'activeUser'
    ])
  },
  methods: {
    setActiveContainerID (payload) {
      this.activeContainerID = payload
    },
    setActiveScene (payload) {
      this.activeSceneID = payload
    },
    setActiveProjectID (payload) {
      this.activeProjectID = payload
    }
  },
  data () {
    return {
      activeContainerID: 'none',
      activeSceneID: 'none',
      activeProjectID: 'none'
    }
  }
}
</script>

<style scoped>
  .home {
    background-color: #1F2933;
  }
  .toolrow {
    margin-bottom: 0px
  }
  hr {
    border-top: 1px solid #f5f7fa;;
  }
</style>
