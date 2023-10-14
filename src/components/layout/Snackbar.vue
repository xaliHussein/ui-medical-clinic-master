<template>
  <v-snackbar
    dir="rtl"
    v-model="snack"
    :multi-line="true"
    :color="snack_message.color"
    timeout="4000"
    outlined>
    <h4 v-for="(text, index) in snack_message.text.split('\n')" :key="index">
      {{ index == 0 ? "" : index + "-" }} {{ text }}
    </h4>
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" icon class="ml-3">
        <Icon
          :icon="snack_message.icon"
          :color="snack_message.color"
          width="30" />
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
  export default {
    props: {
      snack_message: {
        type: Object,
        required: false,
      },
    },
    data() {
      return {
        snack: true,
      };
    },
  };
</script>
