<template>
  <div>
    <b-container id="tools">
    <b-row>
      <b-dropdown id="dropdown-right" right text="Create New" class="toolbar" align ="left">
          <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('project')">Project </b-dropdown-item>
          <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('scene')">Scene </b-dropdown-item>
          <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('speaker')">Speaker </b-dropdown-item>
          <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('mod')">Custom Mod </b-dropdown-item>
      </b-dropdown>
      <b-dropdown id="dropdown-right" right text="Delete" class="toolbar" align ="left">
          <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('delproject')">Project </b-dropdown-item>
          <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('delscene')">Scene </b-dropdown-item>
          <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('delspeaker')">Speaker </b-dropdown-item>
          <b-dropdown-item aria-controls="collapse-1" v-on:click="clicked('delcustommod')">Custom Mod </b-dropdown-item>
      </b-dropdown>
      <b-button class="toolbar" align="left" aria-controls="collapse-1" v-on:click="clicked('importing')">
        Import
      </b-button>
      <Export
          v-bind:activeSceneID="activeSceneID"
          v-bind:activeProjectID="activeProjectID"
          class="toolbar" align ="left"/>
      <CloudPublish
          v-bind:activeSceneID="activeSceneID"
          v-bind:activeProjectID="activeProjectID"
          class="toolbar" align ="left"/>
    </b-row>
    </b-container>
    <b-collapse id="collapse-1" v-model="visible" class="mt-2">
        <SceneCreate @close="close" @created="created" @setActiveSceneID="setActiveSceneID" v-if="(type === 'scene')"/>
        <ProjectCreate @close="close" @created="created" @setActiveProjectID="setActiveProjectID" v-if="(type === 'project')"/>
        <SpeakerCreate @close="close" @created="created" v-if="(type === 'speaker')"/>
        <CustomModCreate @close="close" @created="created" v-if="(type === 'mod')"/>

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
        <SpeakerDelete
        v-if="(type === 'delspeaker')"
        @close="close"/>
        <CustomModDelete
        v-if="(type === 'delcustommod')"
        @close="close"/>

        <Import
        v-bind:activeSceneID="activeSceneID"
        v-if="(type === 'importing')"
        @setActiveProjectID="setActiveProjectID"
        @setActiveSceneID="setActiveSceneID"
        @close="close"/>
    </b-collapse>
  </div>
</template>

<script>
import SceneCreate from '@/components/SceneCreate.vue'
import ProjectCreate from '@/components/ProjectCreate.vue'
import SpeakerCreate from '@/components/SpeakerCreate.vue'
import CustomModCreate from '@/components/CustomModCreate.vue'

import ProjectDelete from '@/components/ProjectDelete.vue'
import SceneDelete from '@/components/SceneDelete.vue'
import SpeakerDelete from '@/components/SpeakerDelete.vue'
import CustomModDelete from '@/components/CustomModDelete.vue'

import Import from '@/components/Import.vue'
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
    CloudPublish,
    CustomModCreate,
    CustomModDelete,
    SpeakerDelete,
    Import
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
      if (this.type === type) {
        this.close()
      } else {
        this.type = type
      }
    },
    close (payload) {
      this.visible = false
      this.type = 'none'
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
    margin-right: 15px;
  }
  .btn.dropdown-toggle, .btn.dropdown-toggle:hover,
  .btn.dropdown-toggle:focus {
    background: #b085f5;
    color: #f5f7fa;
    border-color: #b085f5;
  }
  #tools {
    margin-left: 15px
  }
</style>
