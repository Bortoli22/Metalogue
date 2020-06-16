<template>
    <div>

        <b-form-textarea
      id="dtext"
      v-model="msg"
      placeholder="Dialogue Here..."
      rows="2"
      max-rows="6"
    ></b-form-textarea>
    Message: {{msg}}
    </div>
</template>

<script>
export default {
  data () {
    return {
      text: ''
    }
  },
  props: {
    msg: String
  }
}
</script>
