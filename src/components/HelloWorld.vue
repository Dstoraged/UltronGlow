<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="container">
      <div
        id="indicators"
        class="carousel slide w-100"
        data-ride="carousel"
        data-keyboard="false"
        data-pause="hover"
        data-interval="5000"
      >
        <ol class="carousel-indicators">
          <li data-target="#indicators" data-slide-to="0" class="active"></li>
          <li data-target="#indicators" data-slide-to="1"></li>
          <li data-target="#indicators" data-slide-to="2"></li>
          <li data-target="#indicators" data-slide-to="3"></li>
          <li data-target="#indicators" data-slide-to="4"></li>
          <li data-target="#indicators" data-slide-to="5"></li>
          <li data-target="#indicators" data-slide-to="6"></li>
          <li data-target="#indicators" data-slide-to="7"></li>
          <li data-target="#indicators" data-slide-to="8"></li>
        </ol>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img class="d-block w-100" src="../assets/1.jpg" />
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src="../assets/2.jpg" />
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src="../assets/3.jpg" />
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src="../assets/4.jpg" />
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src="../assets/5.jpg" />
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src="../assets/6.jpg" />
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src="../assets/7.jpg" />
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src="../assets/6.jpg" />
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src="../assets/7.jpg" />
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src="../assets/8.jpg" />
          </div>
        </div>
        <a
          class="carousel-control-prev"
          href="#indicators"
          role="button"
          data-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        </a>
        <a
          class="carousel-control-next"
          href="#indicators"
          role="button"
          data-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
