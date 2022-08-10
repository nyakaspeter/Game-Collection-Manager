<script>
export default {
  el: "div",
  props: {
    set: { type: Boolean, default: true },
    value: { type: Array, default: [] },
    placeholder: { type: String, default: "" },
  },
  data() {
    return {
      chips: [],
      currentInput: "",
    };
  },
  methods: {
    saveChip() {
      const { chips, currentInput, set } = this;
      ((set && chips.indexOf(currentInput) === -1) || !set) &&
        currentInput &&
        chips.push(currentInput);
      this.currentInput = "";
      this.$emit("input", this.chips);
    },
    deleteChip(index) {
      this.chips.splice(index, 1);
      this.$emit("input", this.chips);
    },
    backspaceDelete(event) {
      event.which == 8 &&
        this.currentInput === "" &&
        this.deleteChip(this.chips.length - 1);
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue, oldValue) {
        this.chips = newValue;
      },
    },
  },
};
</script>

<template>
  <div class="py-1">
    <div class="chip-container">
      <div class="chip" v-for="(chip, i) of chips" :key="chip.label">
        {{ chip }}
        <i class="cursor-pointer" @click="deleteChip(i)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="ml-1 inline-block w-4 h-4 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </i>
      </div>
      <input
        :placeholder="placeholder"
        class="input input-xs text-sm input-ghost flex-auto focus:outline-0"
        v-model="currentInput"
        @input.stop
        @keypress.enter="saveChip"
        @keydown.delete="backspaceDelete"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.chip-container {
  @apply textarea textarea-bordered w-full p-3 flex flex-wrap gap-1 content-between;
}

.chip-container:focus-within {
  @apply outline outline-2 outline-offset-2 outline-base-300;
}

.chip {
  @apply badge badge-lg flex gap-1 items-center;
}
</style>
