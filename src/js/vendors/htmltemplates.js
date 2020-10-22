const productSlideHTML = `
  <div class="product-item productview-item {?itemType?}">
    <div class="product-data">
      <input type="hidden" class="product-data-id" name="product-data-id" value="{?id?}" />
      <input type="hidden" class="product-data-name" name="product-data-name" value="{?name?}" />
      <input type="hidden" class="product-data-price" name="product-data-price" value="{?price?}" />
    </div>
    <div class="product-item-wrapper">
      <div class="product-item-image">
        {?generateProductTag?}
        <a href="product.html?prodid={?id?}" class="product-item-image-link" title="{?name?}">
          <img src="{?imagePreview?}" alt="{?name?}">
        </a>
        <a href="#quickview" class="btn quickview-button" data-prodid="{?id?}">Quick View</a>
      </div>
      <div class="product-item-context">
        <a href="product.html?prodid={?id?}" class="product-item-name" title="{?name?}">
          {?name?}
        </a>
        <div class="product-item-rating">
          <div class="star-rating" title="{?rating?}">
            <span style="width: {?ratingPercent?}%"></span>
          </div>
        </div>
        <div class="product-item-price">
          {?price?}
        </div>
    </div>
    <div class="product-item-actions">
      <a href="#add-to-cart" class="btn btn-primary add-to-cart-button">
        <i class="m-icon">shopping_cart</i>
        <span>Add to Cart</span>
      </a>
      <a href="#add-to-wishlist" class="btn add-to-wishlist-button">
        <i class="m-icon">favorite_border</i>
        <span>Add to Wish List</span>
      </a>
      <a href="#add-to-wishlist" class="btn compare-button">
        <i class="m-icon">compare_arrows</i>
        <span>Compare Product</span>
      </a>
    </div>
  </div>
</div>
`;

const quickViewHTML = `
  <div class="row productview-container productview-item">
    <div class="product-data">
      <input type="hidden" class="product-data-id" name="product-data-id" value="{?id?}" />
      <input type="hidden" class="product-data-name" name="product-data-name" value="{?name?}" />
      <input type="hidden" class="product-data-price" name="product-data-price" value="{?price?}" />
    </div>
    <div class="col-md-6 productview-media">
      {?generateProductTag?}
      <div class="productview-image">
        <img src="{?image?}" alt="">
      </div>
    </div>
    <div class="col-md-6">
      <div class="productview-details">
        <div class="productview-name">
          <h1 class="product-name">{?name?}</h1>
        </div>
        <div class="productview-make">
          <p>Brand: <a href="category.html">{?brand?}</a></p>
          <p>Product Code: {?code?}</p>
          <p>Availability: {?availability?}</p>
        </div>
        <div class="productview-price">
          <h3>{?price?}</h3>
        </div>
        {?generateOptions?}
        <div class="productview-actions">
          <div class="cartbox-quantity">
            <div class="cartbox-quantity-label">Qty</div>
            <div class="cartbox-quantity-spinner">
              <input class="input-spinner" type="number" value="1" min="1" max="99" step="1"/>
            </div>
            <a href="#add-to-cart" class="btn btn-primary add-to-cart-button cartbox-btn-add">Add to Cart</a>
          </div>
          <div class="cartbox-extra">
            <a href="#add-to-wishlist" class="add-to-wishlist-button cartbox-btn-wishlist">
              <i class="m-icon">favorite_border</i>
              <span>Add to Wish List</span>
            </a>
            <a href="#add-to-wishlist" class=" cartbox-btn-compare">
              <i class="m-icon">compare_arrows</i>
              <span>Compare This Product</span>
            </a>
          </div>
      </div>
      <div class="productview-reviews">
        <div class="product-slider-item-rating">
          <div class="star-rating" title="{?rating?}">
            <span style="width: {?ratingPercent?}%"></span>
          </div>
        </div>
        <div class="productview-reviews-link">
          <a href="./product.html?prodid={?id?}&scrollto=readreview">{?reviews?} reviews</a>
          <a href="./product.html?prodid={?id?}&scrollto=writereview">Write a review</a>
        </div>
      </div>
    </div>
  </div>
</div>
`;