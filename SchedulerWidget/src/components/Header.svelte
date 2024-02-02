<script>
  let menuOpen = false;
  let isMobile = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  import { onMount } from "svelte";

  onMount(() => {
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  });

  function checkScreenWidth() {
    isMobile = window.innerWidth <= 768;
  }
</script>

<header>
  <div class="company-name">WELLS FARGO</div>

  <button on:click={toggleMenu} class="menu-button"> ☰ </button>

  <nav class:mobile={isMobile} class:open={menuOpen}>
    <a href="/">Home</a>
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: red;
    color: white;
  }

  .company-name {
    font-size: 1.5rem;
  }

  nav {
    display: flex;
  }

  nav a {
    margin-right: 1rem;
    color: white;
    text-decoration: none;
  }

  .menu-button {
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }

  nav.mobile {
    flex-direction: column;
    position: absolute;
    top: 60px;
    right: 0;
    background-color: #333;
    color: white;
    padding: 1rem;
    display: none;
  }

  nav.mobile.open {
    display: flex;
  }

  @media (max-width: 768px) {
    .menu-button {
      display: block;
    }
  }
</style>
