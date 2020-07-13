<template>
  <div>
    <b-dropdown id="dropdown-right" right text="Create New" variant="info">
        <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('project')">Project </b-dropdown-item>
        <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('scene')">Scene </b-dropdown-item>
        <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('speaker')">Speaker </b-dropdown-item>
    </b-dropdown>
    <b-collapse id="collapse-1" v-model="visible" class="mt-2">
        <SceneCreate @close="close" @created="created" @setActiveSceneID="setActiveSceneID" v-if="(type === 'scene')"/>
        <ProjectCreate @close="close" @created="created" @setActiveProjectID="setActiveProjectID" v-if="(type === 'project')"/>
        <SpeakerCreate @close="close" @created="created" v-if="(type === 'speaker')"/>
    </b-collapse>
  </div>
</template>

<script>
import SceneCreate from '@/components/SceneCreate.vue'
import ProjectCreate from '@/components/ProjectCreate.vue'
import SpeakerCreate from '@/components/SpeakerCreate.vue'

export default {
  components: {
    ProjectCreate,
    SceneCreate,
    SpeakerCreate
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
  }
}
</script>
