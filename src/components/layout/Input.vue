<template>
  <v-text-field
    class="font-weight-black"
    :value="value"
    :type="type"
    :label="label"
    color="#159895"
    outlined
    rounded
    clearable
    lazy-rules
    @input="$emit('update-value', $event)"
    :hint="hint"
    persistent-hint
    :rules="rules"
    hide-details="auto" />
</template>
<script>
  export default {
    props: {
      type: {
        type: [String, Number],
      },
      label: String,
      value: {
        type: [String, Number],
        default: "",
      },
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
