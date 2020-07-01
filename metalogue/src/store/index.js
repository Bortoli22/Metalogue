import Vue from 'vue'
import Vuex from 'vuex'

import dialogueData from '@/data/dialogueData.js'
import characterBank from '@/data/characterBank.js'
import dialogueBank from '@/data/dialogueBank.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dialogueData,
    characterBank,
    dialogueBank
  },
  mutations: {
    appendDialogue: (state, Dialogue) => {
      state.dialogueData.push(Dialogue)
    },
    modifyDialogue: (state, Dialogue) => {
      const toModIndex = state.dialogueData.findIndex(element => element.id === Dialogue.id)
      if (toModIndex > -1) {
        state.dialogueData[toModIndex] = Dialogue
      }
    },
    modifySpeaker: (state, Dialogue) => {
      const toModIndex = state.dialogueData.findIndex(element => element.id === Dialogue.id)
      if (toModIndex > -1) {
        state.dialogueData[toModIndex].name = Dialogue.name
      }
    },
    removeDialogue: (state, id) => {
      const toModIndex = state.dialogueData.findIndex(element => element.id === id)
      if (toModIndex > -1) {
        state.dialogueData.splice(toModIndex, 1)
      }
    },
    appendSpeaker: (state, Speaker) => {
      state.characterBank.push(Speaker)
    }
  },
  actions: {
    addDialogue: ({ commit }, added) => {
      commit('appendDialogue', added)
    },
    modDialogue: ({ commit }, modded) => {
      commit('modifyDialogue', modded)
    },
    modSpeaker: ({ commit }, modded) => {
      commit('modifySpeaker', modded)
    },
    remDialogue: ({ commit }, removed) => {
      commit('removeDialogue', removed)
    },
    addSpeaker: ({ commit }, added) => {
      commit('appendSpeaker', added)
    }
  },
  modules: {
  }
})
