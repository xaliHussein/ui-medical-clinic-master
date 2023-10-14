<template>
  <v-select
    :value="value"
    :items="items"
    :item-text="itemText"
    :item-value="itemValue"
    return-object
    class="font-weight-black"
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
    hide-details="auto"></v-select>
</template>
<script>
  export default {
    props: {
      label: String,
      value: {
        type: [Object, Number],
        default: null,
      },
      itemText: {
        type: [String],
        required: true,
      },
      itemValue: {
        type: [String, Number],
        required: true,
      },
      items: {
        type: Array,
        required: true,
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
