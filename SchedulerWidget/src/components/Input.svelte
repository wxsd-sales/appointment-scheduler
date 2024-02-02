<script>
  export let type = "text";
  export let name = "";
  export let placeholder = "";
  export let disabled = false;
  export let required = false;
  export let readonly = false;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  //@ts-ignore
  function onChange(event) {
    dispatch("onChange", event.target.value);
  }
</script>

<input
  {type}
  id={name}
  {name}
  {placeholder}
  on:change={onChange}
  {required}
  {disabled}
  {readonly}
/>

<style>
  input {
    width: 90%;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-sizing: border-box;
  }
</style>
