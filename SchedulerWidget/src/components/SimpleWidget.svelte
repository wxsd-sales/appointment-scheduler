<script>
  //export let name;
  import { onMount } from "svelte";

  import { datePicker } from "svelte-flatpickr-plus";
  import flatpickr from "flatpickr";
  import "flatpickr/dist/flatpickr.min.css";
  import "flatpickr/dist/themes/dark.css";
  import Input from "./Input.svelte";

  //import Input from "./Input.svelte";

  let date = new Date();

  const options = {
    dateFormat: "Z",
    altFormat: "d F Y",
    altInput: true,
  };

  onMount(() => {
    flatpickr("#datePicker", {
      enableTime: false,
      dateFormat: "m/d/Y",
      minDate: "today",
      // @ts-ignore
      defaultDate: date,
      onChange: (selectedDates) => {
        date = selectedDates[0];

        //saveFormData({ calendarDate: selectedDates[0] });
      },
    });
  });
</script>

<Input name="datePicker" placeholder="Select date..." required readonly />

<style>
</style>
