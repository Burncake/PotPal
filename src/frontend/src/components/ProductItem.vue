<template>
  <div class="card my-3">
    <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
      <slot name="image">
        <img src="https://mdbootstrap.com/img/new/standard/nature/111.webp" class="img-fluid"
      /></slot>

      <a href="#!">
        <div class="mask" style="background-color: rgba(251, 251, 251, 0.15)"></div>
      </a>
    </div>

    <div class="card-body">
      <slot name="title"><h5 class="card-title">Card title</h5></slot>
      <!-- <h5 class="card-text">Card title</h5> -->
      <slot name="price"><p class="card-text">100</p></slot>

      <button type="button" class="btn btn-primary">Add to card</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  max-height: 400px;
}
.card img {
  height: 200px;
}
</style>
