<template>
  <div>
    <b-container>
    <b-row>
      <b-dropdown id="dropdown-right" right text="Create New" variant="info" class="toolbar" align ="left">
          <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('project')">Project </b-dropdown-item>
          <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('scene')">Scene </b-dropdown-item>
          <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('speaker')">Speaker </b-dropdown-item>
      </b-dropdown>
      <b-dropdown id="dropdown-right" right text="Delete" variant="danger" class="toolbar" align ="left">
          <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('delproject')">Project </b-dropdown-item>
          <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('delscene')">Scene </b-dropdown-item>
      </b-dropdown>
      <Export
          v-bind:activeSceneID="activeSceneID"
          v-bind:activeProjectID="activeProjectID"
          class="toolbar" align ="left"/>
      <CloudPublish v-bind:activeProjectID="activeProjectID" />
    </b-row>
    </b-container>
    <b-collapse id="collapse-1" v-model="visible" class="mt-2">
        <SceneCreate @close="close" @created="created" @setActiveSceneID="setActiveSceneID" v-if="(type === 'scene')"/>
        <ProjectCreate @close="close" @created="created" @setActiveProjectID="setActiveProjectID" v-if="(type === 'project')"/>
        <SpeakerCreate @close="close" @created="created" v-if="(type === 'speaker')"/>

        <ProjectDelete
        v-bind:activeSceneID="activeSceneID"
        v-bind:activeProjectID="activeProjectID"
        v-if="(type === 'delproject')"
        @close="close"
        @setActiveProjectID="setActiveProjectID"
        @setActiveSceneID="setActiveSceneID"/>
        <SceneDelete
        v-bind:activeSceneID="activeSceneID"
        v-bind:activeProjectID="activeProjectID"
        v-if="(type === 'delscene')"
        @close="close"
        @setActiveScene="setActiveSceneID"/>
    </b-collapse>
  </div>
</template>

<script>
import SceneCreate from '@/components/SceneCreate.vue'
import ProjectCreate from '@/components/ProjectCreate.vue'
import SpeakerCreate from '@/components/SpeakerCreate.vue'

import ProjectDelete from '@/components/ProjectDelete.vue'
import SceneDelete from '@/components/SceneDelete.vue'

import Export from '@/components/Export.vue'
import CloudPublish from '@/components/CloudPublish.vue'

export default {
  components: {
    Export,
    ProjectCreate,
    SceneCreate,
    ProjectDelete,
    SceneDelete,
    SpeakerCreate,
    CloudPublish
  },
  data () {
    return {
      type: 'none',
      visible: false
    }
  },
  methods: {
    clicked (type) {
      this.visible = true
      this.type = type
    },
    close (payload) {
      this.visible = false
    },
    created (payload) {
      this.type = 'none'
      this.visible = false
    },
    setActiveSceneID (payload) {
      this.$emit('setActiveSceneID', payload)
    },
    setActiveProjectID (payload) {
      this.$emit('setActiveProjectID', payload)
    }
  },
  props: {
    activeSceneID: String,
    activeProjectID: String
  }
}
</script>

<style>
  .toolbar {
    padding: 0px 20px 20px 0px
  }
</style>
