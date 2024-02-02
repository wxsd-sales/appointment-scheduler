<script>
  import DatePickerForm from "./DatePickerForm.svelte";
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

  // @ts-ignore
  export let notifyChanges; // Add this prop

  export function getFormData() {
    return formData;
  }

  /** @ts-ignore*/
  function saveFormData(data) {
    formData = { ...formData, ...data.detail };

    // @ts-ignore
    if (notifyChanges) notifyChanges(formData);
  }
</script>

<div class="widget-container box panel">
  <DatePickerForm {formData} on:save={saveFormData} />
</div>

<style>
  .widget-container {
    max-width: 1080px;
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 20px;
    background-color: #f9f9f9;
    display: flex;
    align-items: center;
  }
</style>
