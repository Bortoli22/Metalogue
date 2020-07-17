import Vue from 'vue'
import Vuex from 'vuex'

import dialogueData from '@/data/dialogueData.js'
import characterBank from '@/data/characterBank.js'
import dialogueBank from '@/data/dialogueBank.js'
import activeUser from '@/data/user.js'
import projectBank from '@/data/projectBank.js'
import customMod from '@/data/customMod.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dialogueData,
    characterBank,
    dialogueBank,
    activeUser,
    projectBank,
    customMod
  },
  mutations: {
    addCustomMod: (state, mod) => {
      state.customMod.push(mod)
    },
    appendCustomModToDC: (state, mod) => {
      const toModIndex = state.dialogueData.findIndex(e => e.id === mod.id)
      state.dialogueData[toModIndex].mod.push(mod.mod)
    },
    appendDialogue: (state, Dialogue) => {
      if (Dialogue.active < 0) {
        state.dialogueData.push(Dialogue)
      } else {
        state.dialogueData.splice(Dialogue.active + 1, 0, Dialogue)
      }
    },
    appendProject: (state, project) => {
      const toInsert = { name: project.projectName, id: project.projectID, sceneBank: [] }
      state.projectBank.push(toInsert)
    },
    appendScene: (state, scene) => {
      const toInsert = { name: scene.sceneName, id: scene.sceneID, data: [] }
      state.dialogueBank.push(toInsert)
    },
    appendSpeaker: (state, Speaker) => {
      state.characterBank.push(Speaker)
    },
    changeActiveUser: (state, user) => {
      state.activeUser = user
    },
    loadFromCloud: (state, bank) => {
      // pop all Bank data
      var oldLength = state.dialogueData.length
      var x, element
      for (x = 0; x < oldLength; x++) {
        state.dialogueData.pop()
      }
      oldLength = state.dialogueBank.length
      for (x = 0; x < oldLength; x++) {
        state.dialogueBank.pop()
      }
      oldLength = state.projectBank.length
      for (x = 0; x < oldLength; x++) {
        state.projectBank.pop()
      }
      // push fire data to projectBank
      if (bank.length > 0) {
        for (element of bank) {
          state.projectBank.push(element)
        }
        // push fire data to dialogueBank
        if (bank[0].sceneBank.length > 0) {
          for (element of bank[0].sceneBank) {
            state.dialogueBank.push(element)
          }
          // push fire data to dialogueData
          if (bank[0].sceneBank[0].data.length > 0) {
            for (element of bank[0].sceneBank[0].data) {
              state.dialogueData.push(element)
            }
          }
        }
      }
    },
    modifyDialogue: (state, Dialogue) => {
      const toModIndex = state.dialogueData.findIndex(element => element.id === Dialogue.id)
      if (toModIndex > -1) {
        state.dialogueData.splice(toModIndex, 1, Dialogue)
      }
    },
    modifySpeaker: (state, Dialogue) => {
      const toModIndex = state.dialogueData.findIndex(element => element.id === Dialogue.id)
      if (toModIndex > -1) {
        state.dialogueData[toModIndex].name = Dialogue.name
      }
    },
    projectSyncing: (state, project) => {
      // push updates from dialogueData to dialogueBank
      var toModIndex = state.dialogueBank.findIndex(scene => scene.id === project.scene)
      console.log('toModIndex ' + toModIndex)
      var oldData = []
      var element
      var toInsert
      for (element of state.dialogueData) {
        oldData.push(element)
      }
      if (toModIndex > -1) {
        toInsert = { name: state.dialogueBank[toModIndex].name, id: project.scene, data: oldData }
        state.dialogueBank[toModIndex] = toInsert
      }

      // push updates from dialogueBank to projectBank
      toModIndex = state.projectBank.findIndex(p => p.id === project.project)
      oldData = []
      for (element of state.dialogueBank) {
        oldData.push(element)
      }
      if (toModIndex > -1) {
        toInsert = { name: state.projectBank[toModIndex].name, id: project.project, sceneBank: oldData }
        state.projectBank[toModIndex] = toInsert
      }
    },
    removeCustomMod: (state, mod) => {
      const toModIndex = state.customMod.findIndex(element => element.flag === mod.flag)
      state.customMod.splice(toModIndex, 1)
    },
    removeCustomModFromDC: (state, mod) => {
      const toModIndex = state.dialogueData.findIndex(e => e.id === mod.id)
      const spliceIndex = state.dialogueData[toModIndex].mod.findIndex(e => e.flag === mod.mod.flag)
      if (spliceIndex > -1) {
        state.dialogueData[toModIndex].mod.splice(spliceIndex, 1)
      }
    },
    removeDialogue: (state, id) => {
      const toModIndex = state.dialogueData.findIndex(element => element.id === id)
      if (toModIndex > -1) {
        state.dialogueData.splice(toModIndex, 1)
      }
    },
    removeProject: (state, project) => {
      const toModIndex = state.projectBank.findIndex(element => element.id === project)
      if (toModIndex > -1) {
        state.projectBank.splice(toModIndex, 1)
      }
    },
    removeScene: (state, scene) => {
      const toModIndex = state.dialogueBank.findIndex(element => element.id === scene)
      if (toModIndex > -1) {
        state.dialogueBank.splice(toModIndex, 1)
      }
    },
    removeSpeaker: (state, speaker) => {
      const toModIndex = state.characterBank.findIndex(element => element.spID === speaker)
      state.characterBank.splice(toModIndex, 1)
    },
    swapBankData: (state, bank) => {
      console.log('enter swapBank: ' + bank.old + bank.new)
      // push updates to Bank
      var toModIndex = state.dialogueBank.findIndex(scene => scene.id === bank.old)
      console.log('toModIndex ' + toModIndex)
      var oldData = []
      var element
      for (element of state.dialogueData) {
        oldData.push(element)
      }
      var x, oldLength
      oldLength = state.dialogueData.length
      for (x = 0; x < oldLength; x++) {
        state.dialogueData.pop()
      }
      if (toModIndex > -1) {
        var toInsert = { name: state.dialogueBank[toModIndex].name, id: bank.old, data: oldData }
        state.dialogueBank[toModIndex] = toInsert
      }
      // swap to new Scene
      if (bank.new === undefined) {
        // swapping because of scene deletion
        console.log('swapping because of a deletion')
        toModIndex = 0
      } else {
        // swapping because of selection of another scene
        toModIndex = state.dialogueBank.findIndex(scene => scene.id === bank.new)
      }
      // push new data to dialogueData
      if (state.dialogueBank.length > 0) {
        for (element of state.dialogueBank[toModIndex].data) {
          state.dialogueData.push(element)
        }
      }
    },
    swapProjectBank: (state, project) => {
      console.log('enterswapproject: ' + project.old + ', ' + project.new)
      // push updates from dialogueData to dialogueBank
      var toModIndex = state.dialogueBank.findIndex(scene => scene.id === project.sceneID)
      console.log('toModIndex ' + toModIndex)
      var oldData = []
      var element
      var toInsert
      for (element of state.dialogueData) {
        oldData.push(element)
      }
      var x, oldLength
      oldLength = state.dialogueData.length
      for (x = 0; x < oldLength; x++) {
        state.dialogueData.pop()
      }
      if (toModIndex > -1) {
        toInsert = { name: state.dialogueBank[toModIndex].name, id: project.sceneID, data: oldData }
        state.dialogueBank[toModIndex] = toInsert
      }

      // push updates from dialogueBank to projectBank
      toModIndex = state.projectBank.findIndex(p => p.id === project.old)
      console.log('toModIndex ' + toModIndex)
      oldData = []
      for (element of state.dialogueBank) {
        oldData.push(element)
      }
      oldLength = state.dialogueBank.length
      for (x = 0; x < oldLength; x++) {
        state.dialogueBank.pop()
      }
      if (toModIndex > -1) {
        toInsert = { name: state.projectBank[toModIndex].name, id: project.old, sceneBank: oldData }
        state.projectBank[toModIndex] = toInsert
      }

      // swap to new project
      if (project.new === undefined) {
        // swapping because of project deletion
        console.log('swapping because of a deletion')
        toModIndex = 0
      } else {
        // swapping because of selection of another project
        toModIndex = state.projectBank.findIndex(p => p.id === project.new)
      }

      // pull new dialogueBank data from projectBank
      if (state.projectBank.length > 0) {
        for (element of state.projectBank[toModIndex].sceneBank) {
          state.dialogueBank.push(element)
        }
      }

      // pull new dialogueData from first scene in dialogueBank
      if (state.dialogueBank.length > 0) {
        for (element of state.dialogueBank[0].data) {
          state.dialogueData.push(element)
        }
      }
    }
  },
  actions: {
    addCMod: ({ commit }, mod) => {
      commit('addCustomMod', mod)
    },
    addCModToDC: ({ commit }, mod) => {
      commit('appendCustomModToDC', mod)
    },
    addDialogue: ({ commit }, added) => {
      commit('appendDialogue', added)
    },
    addProject: ({ commit }, project) => {
      commit('appendProject', project)
    },
    addScene: ({ commit }, scene) => {
      commit('appendScene', scene)
    },
    addSpeaker: ({ commit }, added) => {
      commit('appendSpeaker', added)
    },
    changeUser: ({ commit }, user) => {
      commit('changeActiveUser', user)
    },
    fireLoad: ({ commit }, bank) => {
      commit('loadFromCloud', bank)
    },
    modDialogue: ({ commit }, modded) => {
      commit('modifyDialogue', modded)
    },
    modSpeaker: ({ commit }, modded) => {
      commit('modifySpeaker', modded)
    },
    projectSync: ({ commit }, project) => {
      commit('projectSyncing', project)
    },
    remCModFromDC: ({ commit }, mod) => {
      commit('removeCustomModFromDC', mod)
    },
    remCMod: ({ commit }, mod) => {
      commit('removeCustomMod', mod)
    },
    remDialogue: ({ commit }, removed) => {
      commit('removeDialogue', removed)
    },
    remProject: ({ commit }, project) => {
      commit('removeProject', project)
    },
    remScene: ({ commit }, scene) => {
      commit('removeScene', scene)
    },
    remSpeaker: ({ commit }, speaker) => {
      commit('removeSpeaker', speaker)
    },
    swapBank: ({ commit }, bank) => {
      commit('swapBankData', bank)
    },
    swapProject: ({ commit }, project) => {
      commit('swapProjectBank', project)
    }
  },
  modules: {
  }
})
