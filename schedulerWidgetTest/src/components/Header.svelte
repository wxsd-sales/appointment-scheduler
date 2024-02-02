  
  <script>
    import { base } from '$app/paths';
  </script>
  
  <nav class="navbar is-fixed-top has-shadow custom-red" aria-label="main navigation">
    <div class="navbar-brand">
          <a class="navbar-item" href="{base}/">
          <img class ="logo" src="/company-logo.png" alt="Delete Recording App" />
        </a>

      <button
        id="main-burger"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
    </div>
  </nav>


  <style>
    #app {
        min-height: 100vh;
        }
        .custom-red{
    background-color: #D71D28;
    color: white;
}
.logo{
    padding-top: 1%;
    padding-bottom: 1%;
    padding-left: 20%;
}
.navbar-burger{
    color:white;
}
  </style>