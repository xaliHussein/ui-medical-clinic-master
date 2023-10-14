<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :append-icon="clearIcon"
        @click:append="$emit('clearInput')"
        :value="value"
        :rules="rules"
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
    <v-date-picker
      :value="value"
      color="#159895"
      @input="$emit('update-value', $event)"
      @change="menu = false"></v-date-picker>
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
        type: String,
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
        clearIcon: "mdi-close",
      };
    },
  };
</script>
