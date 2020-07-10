<template>
    <div>
        <b-dropdown id="dropdown-right" right text="Export" variant="success">
            <b-dropdown-group id="dropdown-group-1" header="Scene">
                <b-dropdown-item v-on:click="exporting('scene', 'mm')">Export as MM </b-dropdown-item>
                <b-dropdown-item v-on:click="exporting('scene', 'json')">Export as JSON </b-dropdown-item>
            </b-dropdown-group>
            <b-dropdown-group id="dropdown-group-2" header="Project">
                <b-dropdown-item v-on:click="exporting('project', 'mm')">Export as MM </b-dropdown-item>
                <b-dropdown-item v-on:click="exporting('project', 'json')">Export as JSON </b-dropdown-item>
            </b-dropdown-group>
        </b-dropdown>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'dialogueData',
      'dialogueBank',
      'projectBank'
    ])
  },
  methods: {
    exporting (operation, type) {
      console.log('exporting')
      var name = 'file1'
      if (operation === 'scene') {
        name = 'scene' + this.activeSceneID
      } else {
        name = 'project' + this.activeProjectID
      }
      var toSend = this.pack(operation, type)
      var element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(toSend))
      element.setAttribute('download', name)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
    pack (operation, type) {
      var packed = ''
      var element
      if (type === 'mm') {
        if (operation === 'scene') {
          for (element of this.dialogueData) {
            packed += this.mm(element)
            console.log(element.id)
          }
        } else {

        }
      } else if (type === 'json') {
        if (operation === 'scene') {
          for (element of this.dialogueData) {
            packed += JSON.stringify(element)
          }
        } else {
          for (element of this.dialogueBank) {
            packed += JSON.stringify(element)
          }
        }
      }
      return packed
    },
    mm (element) {
      console.log(element.id)
      var mmString = '/* '
      mmString = mmString + element.name + ' ' + element.id + ' '
      var f
      var arg
      for (f of element.mod) {
        switch (f.flag) {
          case 'Option':
            mmString += '-o '
            break
          case 'Roulette':
            mmString += '-r '
            break
          case 'Event':
            mmString += '-x '
            break
        }
        for (arg of f.args) {
          mmString = mmString + arg + ' '
        }
      }
      mmString = mmString + '*/ ' + element.msg + '\n'
      return mmString
    }
  },
  props: {
    activeProjectID: String,
    activeSceneID: String
  }
}
</script>
