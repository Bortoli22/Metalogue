import Vue from 'vue'
import Vuex from 'vuex'

import dialogueData from '@/data/dialogueData.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dialogueData
  },
  mutations: {
    appendDialogue: (state, Dialogue) => {
      state.dialogueData.push(Dialogue)
    },
    modifyDialogue: (state, Dialogue) => {
      const toModIndex = state.dialogueData.findIndex(element => element.id === Dialogue.id)
      if (toModIndex > -1) {
        state.dialogueData[toModIndex].msg = Dialogue.msg
      }
    }
  },
  actions: {
    addDialogue: ({ commit }, added) => {
      commit('appendDialogue', added)
    },
    modDialogue: ({ commit }, modded) => {
      commit('modifyDialogue', modded)
    }
  },
  modules: {
  }
})
