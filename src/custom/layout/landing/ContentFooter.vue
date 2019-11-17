<template>
  <footer class="footer" style="padding-left: 0px; background-color: darkslategrey">
    
    <div class="row" style="padding-left: 25px;">
        <div class="col-12 col-md-3 col-xl-2">
            <a href="/" target="_self" title="Analytical Platform" class="footer-brand">
                <img src="https://analyticalplatform.com/img/logotype-ca-gray.svg" class="img img-fluid footer-brand-logo" alt="CYRRUS ADVISORY, a.s.">
            </a>
        </div>
        <div class="col-12 col-md-9">
            <div class="row">
                <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                    <h5>Brno</h5>
                    <p>
                        Veveří 111 (PLATINIUM)<br>
                        616 00 Brno
                    </p>
                    <p>
                        Tel: +420 538 705 775<br>
                        Email:
                        <a href="mailto:brno@cyrrusadvisory.cz" target="_self" title="brno@cyrrusadvisory.cz">
                            brno@cyrrusadvisory.cz
                        </a>
                    </p>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <h5>Praha</h5>
                    <p>
                        Na Florenci 2116/15 (Florentinum recepce A)<br>
                        110 00 Praha 1
                    </p>
                    <p>
                        Tel: +420 277 021 838<br>
                        Email:
                        <a href="mailto:praha@cyrrusadvisory.cz" target="_self" title="praha@cyrrusadvisory.cz">
                            praha@cyrrusadvisory.cz
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="container-fluid" style="border-top: 1px solid hsla(0,0%,100%,.1); padding-top: 10px">
      <ul class="nav">
        <li class="nav-item">
          <a class="nav-link" href="https://www.cyrrusadvisory.cz/">
            Cyrrus Advisory
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="https://www.cyrrusadvisory.cz/category/novinky/">
            Blog
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="https://www.analyticalplatform.com/">
            Analytical Platform
          </a>
        </li>
      </ul>
      <div class="copyright">
        v{{version}} © {{year}} made by
        <a href="https://www.cyrrusadvisory.cz/" target="_blank" rel="noopener">Cyrrus Advisory</a>.
      </div>
    </div>
  </footer>
</template>
<script>
  export default {
    data() {
      return {
        version: process.env.PACKAGE_VERSION,
        year: new Date().getFullYear()
      }
    }
  };
</script>
<style>
</style>
