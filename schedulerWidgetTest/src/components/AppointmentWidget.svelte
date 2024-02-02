<script lang="ts">
  import ContactForm from "./ContactForm.svelte";
  import DatePickerForm from "./DatePickerForm.svelte";
  import SlotsPicker from "./SlotsPicker.svelte";
  import { onMount } from "svelte";
  import "bulma/css/bulma.css";

  let step = 1;

  onMount(() => {
    step = 1;
  });

  let formData = {
    calendarDate: new Date(),
    selectedTimeOfDay: "morning",
  };

  function handleNext() {
    step += 1;
  }

  function handlePrev() {
    step -= 1;
  }

  /** @ts-ignore*/
  function saveFormData(data) {
    formData = { ...formData, ...data.detail };
  }

  function handleSubmit() {
    alert(`Submitted Data: ${JSON.stringify(formData)}`);
  }
</script>

<div class="widget-container1 panel">
  {#if step === 1}
    <SlotsPicker on:next={handleNext} on:save={saveFormData} />
    <!-- <DatePickerForm on:next={handleNext} on:save={saveFormData} /> -->
  {:else if step === 2}
    <ContactForm
      {formData}
      on:previous={handlePrev}
      on:save={saveFormData}
      on:submit={handleSubmit}
    />
  {/if}
</div>

<style>
  .widget-container1 {
    width: 100%;
  }
  
</style>
