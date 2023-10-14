<template>
  <!-- :return-value.sync="value" -->
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="value"
        :rules="rules"
        clearable
        :label="label"
        lazy-rules
        readonly
        color="#159895"
        outlined
        rounded
        :hint="hint"
        persistent-hint
        hide-details="auto"
        class="font-weight-black"
        v-bind="attrs"
        v-on="on"></v-text-field>
    </template>
    <v-time-picker
      v-if="menu"
      :value="value"
      color="#159895"
      full-width
      @input="$emit('update-value', $event)"
      @change="menu = false"
      @click:minute="$refs.menu.save(value)"></v-time-picker>
  </v-menu>
</template>
<script>
  export default {
    props: {
      color: String,
      label: String,
      hint: {
        type: String,
        required: false,
      },
      value: {
        type: [String, Number],
        default: null,
      },
      rules: {
        type: Array,
        required: false,
      },
    },
    data() {
      return {
        menu: false,
      };
    },
  };
</script>
