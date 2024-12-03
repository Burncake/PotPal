<template>
  <div class="row mt-3">
    <aside class="col-sm-3 col-xxl-2">
      <div class="card">
        <article class="filter-group">
          <div class="input-group">
            <input
              type="search"
              class="form-control rounded"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="search-addon"
            />
            <button type="button" class="btn btn-outline-primary" data-mdb-ripple-init>
              <i class="fa fa-search"></i>
            </button>
          </div>
          <header class="card-header">
            <a
              href="#"
              data-bs-toggle="collapse"
              data-bs-target="#collapse_1"
              aria-expanded="true"
              class="d-flex"
            >
              <i class="icon-control fa fa-chevron-down me-auto"></i>
              <h6 class="title me-auto">Product type</h6>
            </a>
          </header>
          <div class="filter-content collapse show" id="collapse_1" style="">
            <div class="card-body">
              <ul class="list-group list-group-light list-group-small">
                <li class="list-group-item"><a href="#">People </a></li>
                <li class="list-group-item"><a href="#">Watches </a></li>
                <li class="list-group-item"><a href="#">Cinema </a></li>
                <li class="list-group-item"><a href="#">Clothes </a></li>
                <li class="list-group-item"><a href="#">Home items </a></li>
                <li class="list-group-item"><a href="#">Animals</a></li>
                <li class="list-group-item"><a href="#">People </a></li>
              </ul>
            </div>
            <!-- card-body.// -->
          </div>
        </article>
        <!-- filter-group  .// -->
        <article class="filter-group">
          <header class="card-header">
            <a
              href="#"
              data-bs-toggle="collapse"
              data-bs-target="#collapse_2"
              aria-expanded="true"
              class="d-flex"
            >
              <i class="icon-control fa fa-chevron-down me-auto"></i>
              <h6 class="title me-auto">Brands</h6>
            </a>
          </header>
          <div class="filter-content collapse show" id="collapse_2" style="">
            <div class="card-body">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                <label class="form-check-label" for="flexCheckDefault">Mercedes</label
                ><b class="badge badge-pill badge-light float-right">120</b>
              </div>

              <label class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" />
                <div class="custom-control-label">
                  Toyota <b class="badge badge-pill badge-light float-right">15</b>
                </div>
              </label>
              <label class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" />
                <div class="custom-control-label">
                  Mitsubishi <b class="badge badge-pill badge-light float-right">35</b>
                </div>
              </label>
              <label class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" />
                <div class="custom-control-label">
                  Nissan <b class="badge badge-pill badge-light float-right">89</b>
                </div>
              </label>
              <label class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" />
                <div class="custom-control-label">
                  Honda <b class="badge badge-pill badge-light float-right">30</b>
                </div>
              </label>
            </div>
            <!-- card-body.// -->
          </div>
        </article>
        <!-- filter-group .// -->
        <article class="filter-group">
          <header class="card-header">
            <a
              href="#"
              data-bs-toggle="collapse"
              data-bs-target="#collapse_3"
              aria-expanded="true"
              class="d-flex"
            >
              <i class="icon-control fa fa-chevron-down me-auto"></i>
              <h6 class="title me-auto">Price range</h6>
            </a>
          </header>
          <div class="filter-content collapse show" id="collapse_3" style="">
            <div class="card-body">
              <input type="range" class="form-range" min="0" max="100" name="" />
              <div class="form-row">
                <div class="col-md-6">
                  <label for="minprice" class="form-label">Min</label>
                  <input id="minprice" class="form-control" placeholder="$0" type="number" />
                </div>
                <div class="text-right col-md-6">
                  <label for="maxprice" class="form-label">Max</label>
                  <input id="maxprice" class="form-control" placeholder="$1,0000" type="number" />
                </div>
              </div>
              <!-- form-row.// -->
              <button class="btn btn-block btn-primary">Apply</button>
            </div>
            <!-- card-body.// -->
          </div>
        </article>
        <!-- filter-group .// -->
        <article class="filter-group">
          <header class="card-header">
            <a
              href="#"
              data-bs-toggle="collapse"
              data-bs-target="#collapse_4"
              aria-expanded="true"
              class="d-flex"
            >
              <i class="icon-control fa fa-chevron-down me-auto"></i>
              <h6 class="title me-auto">Sizes</h6>
            </a>
          </header>
          <div class="filter-content collapse show" id="collapse_4" style="">
            <div class="card-body">
              <label class="checkbox-btn">
                <input type="checkbox" />
                <span class="btn btn-light"> XS </span>
              </label>

              <label class="checkbox-btn">
                <input type="checkbox" />
                <span class="btn btn-light"> SM </span>
              </label>

              <label class="checkbox-btn">
                <input type="checkbox" />
                <span class="btn btn-light"> LG </span>
              </label>

              <label class="checkbox-btn">
                <input type="checkbox" />
                <span class="btn btn-light"> XXL </span>
              </label>
            </div>
            <!-- card-body.// -->
          </div>
        </article>
        <!-- filter-group .// -->
        <article class="filter-group">
          <header class="card-header">
            <a
              href="#"
              data-bs-toggle="collapse"
              data-bs-target="#collapse_5"
              aria-expanded="false"
              class="d-flex"
            >
              <i class="icon-control fa fa-chevron-down me-auto"></i>
              <h6 class="title me-auto">More filter</h6>
            </a>
          </header>
          <div class="filter-content collapse in" id="collapse_5" style="">
            <div class="card-body">
              <label class="custom-control custom-radio">
                <input type="radio" name="myfilter_radio" class="custom-control-input" />
                <div class="custom-control-label">Any condition</div>
              </label>

              <label class="custom-control custom-radio">
                <input type="radio" name="myfilter_radio" class="custom-control-input" />
                <div class="custom-control-label">Brand new</div>
              </label>

              <label class="custom-control custom-radio">
                <input type="radio" name="myfilter_radio" class="custom-control-input" />
                <div class="custom-control-label">Used items</div>
              </label>

              <label class="custom-control custom-radio">
                <input type="radio" name="myfilter_radio" class="custom-control-input" />
                <div class="custom-control-label">Very old</div>
              </label>
            </div>
            <!-- card-body.// -->
          </div>
        </article>
        <!-- filter-group .// -->
      </div>
      <!-- card.// -->
    </aside>
    <main class="col-sm-9 col-xxl-10">
      <header class="border-bottom mb-4 pb-3">
        <div class="row row-cols-sm g-3 align-items-center">
          <span class="col-6 col-xl-8">32 Items found </span>
          <select class="me-2 form-control col">
            <option>Latest items</option>
            <option>Trending</option>
            <option>Most Popular</option>
            <option>Cheapest</option>
          </select>
          <div class="btn-group col-md-3 col-xl-2 shadow-0">
            <a
              href="#"
              class="btn btn-outline-secondary"
              data-bs-toggle="tooltip"
              title="List view"
            >
              <i class="fa fa-bars"></i
            ></a>
            <a
              href="#"
              class="btn btn-outline-secondary active"
              data-bs-toggle="tooltip"
              title="Grid view"
            >
              <i class="fa fa-th"></i
            ></a>
          </div>
        </div>
      </header>
      <!-- sect-heading -->

      <div class="row">
        <div class="col-md-4">
          <figure class="card card-product-grid">
            <div class="img-wrap">
              <span class="badge badge-danger"> NEW </span>
              <img
                src="https://media.istockphoto.com/id/1412728788/vector/free-banner-speech-bubble-label-sticker-ribbon-template-vector-stock-illustration.jpg?s=612x612&w=0&k=20&c=G1GgZfXAm0M62C3KYOBZh6OBt18mEcAbd-hVGWab4WY="
                class="img-fluid"
              />
              <a class="btn-overlay" href="#"><i class="fa fa-search-plus"></i> Quick view</a>
            </div>
            <!-- img-wrap.// -->
            <figcaption class="info-wrap">
              <div class="fix-height">
                <a href="#" class="title">Great item name goes here</a>
                <div class="price-wrap mt-2">
                  <span class="price">$1280</span>
                  <del class="price-old">$1980</del>
                </div>
                <!-- price-wrap.// -->
              </div>
              <a href="#" class="btn btn-block btn-primary">Add to cart </a>
            </figcaption>
          </figure>
        </div>
        <!-- col.// -->

        <div class="col-md-4">
          <figure class="card card-product-grid">
            <div class="img-wrap">
              <img
                src="http://bootstrap-ecommerce.com/bootstrap-ecommerce-html/images/items/7.jpg"
                class="img-fluid"
              />
              <a class="btn-overlay" href="#"><i class="fa fa-search-plus"></i> Quick view</a>
            </div>
            <!-- img-wrap.// -->
            <figcaption class="info-wrap">
              <div class="fix-height">
                <a href="#" class="title">Product name goes here just for demo item</a>
                <div class="price-wrap mt-2">
                  <span class="price">$1280</span>
                </div>
                <!-- price-wrap.// -->
              </div>
              <a href="#" class="btn btn-block btn-primary">Add to cart </a>
            </figcaption>
          </figure>
        </div>
        <!-- col.// -->

        <div class="col-md-4">
          <figure class="card card-product-grid">
            <div class="img-wrap">
              <img
                src="http://bootstrap-ecommerce.com/bootstrap-ecommerce-html/images/items/7.jpg"
                class="img-fluid"
              />
              <a class="btn-overlay" href="#"><i class="fa fa-search-plus"></i> Quick view</a>
            </div>
            <!-- img-wrap.// -->
            <figcaption class="info-wrap">
              <div class="fix-height">
                <a href="#" class="title">Product name goes here just for demo item</a>
                <div class="price-wrap mt-2">
                  <span class="price">$1280</span>
                </div>
                <!-- price-wrap.// -->
              </div>
              <a href="#" class="btn btn-block btn-primary">Add to cart </a>
            </figcaption>
          </figure>
        </div>
        <!-- col.// -->

        <div class="col-md-4">
          <figure class="card card-product-grid">
            <div class="img-wrap">
              <img
                src="http://bootstrap-ecommerce.com/bootstrap-ecommerce-html/images/items/7.jpg"
                class="img-fluid"
              />
              <a class="btn-overlay" href="#"><i class="fa fa-search-plus"></i> Quick view</a>
            </div>
            <!-- img-wrap.// -->
            <figcaption class="info-wrap">
              <div class="fix-height">
                <a href="#" class="title">Product name goes here just for demo item</a>
                <div class="price-wrap mt-2">
                  <span class="price">$1280</span>
                </div>
                <!-- price-wrap.// -->
              </div>
              <a href="#" class="btn btn-block btn-primary">Add to cart </a>
            </figcaption>
          </figure>
        </div>
        <!-- col.// -->

        <div class="col-md-4">
          <figure class="card card-product-grid">
            <div class="img-wrap">
              <img
                src="http://bootstrap-ecommerce.com/bootstrap-ecommerce-html/images/items/7.jpg"
                class="img-fluid"
              />
              <a class="btn-overlay" href="#"><i class="fa fa-search-plus"></i> Quick view</a>
            </div>
            <!-- img-wrap.// -->
            <figcaption class="info-wrap">
              <div class="fix-height">
                <a href="#" class="title">Product name goes here just for demo item</a>
                <div class="price-wrap mt-2">
                  <span class="price">$1280</span>
                </div>
                <!-- price-wrap.// -->
              </div>
              <a href="#" class="btn btn-block btn-primary">Add to cart </a>
            </figcaption>
          </figure>
        </div>
        <!-- col.// -->

        <div class="col-md-4">
          <figure class="card card-product-grid">
            <div class="img-wrap">
              <img
                src="http://bootstrap-ecommerce.com/bootstrap-ecommerce-html/images/items/7.jpg"
                class="img-fluid"
              />
              <a class="btn-overlay" href="#"><i class="fa fa-search-plus"></i> Quick view</a>
            </div>
            <!-- img-wrap.// -->
            <figcaption class="info-wrap">
              <div class="fix-height">
                <a href="#" class="title">Product name goes here just for demo item</a>
                <div class="price-wrap mt-2">
                  <span class="price">$1280</span>
                </div>
                <!-- price-wrap.// -->
              </div>
              <a href="#" class="btn btn-block btn-primary">Add to cart </a>
            </figcaption>
          </figure>
        </div>
        <!-- col.// -->

        <div class="col-md-4">
          <figure class="card card-product-grid">
            <div class="img-wrap">
              <img
                src="http://bootstrap-ecommerce.com/bootstrap-ecommerce-html/images/items/7.jpg"
                class="img-fluid"
              />
              <a class="btn-overlay" href="#"><i class="fa fa-search-plus"></i> Quick view</a>
            </div>
            <!-- img-wrap.// -->
            <figcaption class="info-wrap">
              <div class="fix-height">
                <a href="#" class="title">Product name goes here just for demo item</a>
                <div class="price-wrap mt-2">
                  <span class="price">$1280</span>
                </div>
                <!-- price-wrap.// -->
              </div>
              <a href="#" class="btn btn-block btn-primary">Add to cart </a>
            </figcaption>
          </figure>
        </div>
        <!-- col.// -->

        <div class="col-md-4">
          <figure class="card card-product-grid">
            <div class="img-wrap">
              <img
                src="http://bootstrap-ecommerce.com/bootstrap-ecommerce-html/images/items/7.jpg"
                class="img-fluid"
              />
              <a class="btn-overlay" href="#"><i class="fa fa-search-plus"></i> Quick view</a>
            </div>
            <!-- img-wrap.// -->
            <figcaption class="info-wrap">
              <div class="fix-height">
                <a href="#" class="title">Product name goes here just for demo item</a>
                <div class="price-wrap mt-2">
                  <span class="price">$1280</span>
                </div>
                <!-- price-wrap.// -->
              </div>
              <a href="#" class="btn btn-block btn-primary">Add to cart </a>
            </figcaption>
          </figure>
        </div>
        <!-- col.// -->
      </div>
      <!-- row end.// -->

      <nav class="mt-4" aria-label="Page navigation sample">
        <ul class="pagination">
          <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
          <li class="page-item active"><a class="page-link" href="#">1</a></li>
          <li class="page-item"><a class="page-link" href="#">2</a></li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item"><a class="page-link" href="#">Next</a></li>
        </ul>
      </nav>
    </main>
  </div>
</template>
