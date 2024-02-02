<script>
  export let label = "";
  export let disabled = false;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function onClick() {
    dispatch("onClick");
  }
</script>

<button class="button" {disabled} on:click={onClick}>{label}</button>

<style>
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background-color: #fff;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    width: 200px;
  }
</style>
