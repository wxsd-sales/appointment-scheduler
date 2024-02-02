<script>
  import Header from "../components/Header.svelte";
  import AppointmentWidget from "../components/AppointmentWidget.svelte";
</script>

<Header />

<main>
  <h1>Make an Appointment</h1>
  <AppointmentWidget />
</main>

<style>
  h1 {
    padding-top: 5%;
        display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: 600;
  }
  main {
    margin: 2rem auto;
    padding: 1rem;
  }
</style>
