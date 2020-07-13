<template>
  <div>
    <b-dropdown id="dropdown-right" right text="Create New" variant="info">
        <b-dropdown-item v-b-toggle.collapse-1 v-on:click="clicked('project')">Project </b-dropdown-item>
        <b-dropdown-item v-b-toggle.collapse-1 v-on:click="clicked('scene')">Scene </b-dropdown-item>
        <b-dropdown-item v-b-toggle.collapse-1 v-on:click="clicked('speaker')">Speaker </b-dropdown-item>
    </b-dropdown>
    <b-collapse id="collapse-1" class="mt-2">
        <SceneCreate @created="created" @setActiveSceneID="setActiveSceneID" v-if="(type === 'scene')"/>
        <ProjectCreate @created="created" @setActiveProjectID="setActiveProjectID" v-if="(type === 'project')"/>
        <SpeakerCreate @created="created" v-if="(type === 'speaker')"/>
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
      type: 'none'
    }
  },
  methods: {
    clicked (type) {
      this.type = type
    },
    created (payload) {
      this.type = 'none'
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
