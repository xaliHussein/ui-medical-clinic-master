<template>
  <v-textarea
    class="font-weight-black"
    :value="value"
    :type="type"
    :label="label"
    rows="1"
    outlined
    rounded
    clearable
    lazy-rules
    color="#159895"
    hide-details="auto"
    @input="$emit('update-value', $event)"
    :hint="hint"
    persistent-hint
    :rules="rules"></v-textarea>
</template>
<script>
  export default {
    props: {
      type: String,
      label: String,
      value: String,
      rules: {
        type: Array,
        required: false,
      },
      hint: {
        type: String,
        required: false,
      },
    },
    methods: {},
  };
</script>
