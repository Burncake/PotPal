<template>
    <div class="container">
        <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active" data-bs-interval="2000">
                    <img src="https://cdn.pixabay.com/photo/2020/10/21/18/07/laptop-5673901_1280.jpg"
                        class="d-block w-100" style="height: 80vh; object-fit: cover;" alt="">
                    <div class="carousel-caption">
                        <h5>Laptop Collection</h5>
                        <p>Find Your Perfect Laptop: High Performance, Sleek Designs, and Affordable Prices!</p>
                    </div>
                </div>
                <div class="carousel-item" data-bs-interval="2000">
                    <img src="https://cdn.pixabay.com/photo/2017/04/25/10/08/gaming-2259191_1280.jpg"
                        class="d-block w-100" style="height: 80vh; object-fit: cover;" alt="">
                    <div class="carousel-caption">
                        <h5>Gaming Laptops</h5>
                        <p>Level Up Your Gaming: Explore Our Powerful Gaming Laptops!</p>
                    </div>
                </div>
                <div class="carousel-item" data-bs-interval="2000">
                    <img src="https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg"
                        class="d-block w-100" style="height: 80vh; object-fit: cover;" alt="">
                    <div class="carousel-caption">
                        <h5>Business Laptops</h5>
                        <p>Stay Productive Anywhere: Check Out Our Reliable Business Laptops!</p>
                    </div>
                </div>
                <div class="carousel-item" data-bs-interval="2000">
                    <img src="https://cdn.pixabay.com/photo/2019/08/08/16/54/cpu-4393376_1280.jpg"
                        class="d-block w-100" style="height: 80vh; object-fit: cover;" alt="">
                    <div class="carousel-caption">
                        <h5>High-Performance</h5>
                        <p>Experience Unmatched Power: Laptops with Top-Tier GPU and Cutting-Edge Processors!</p>
                    </div>
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval"
                data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval"
                data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'HomeCarosual',
}
</script>

<style>
.carousel-caption {
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 5px;
}
</style>