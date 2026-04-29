import "../css/Products.css"

function Products() {
  const products = [
    {
      id: 1,
      name: 'Herbal Oil',
      price: 'Rs. 1,200',
      image: '/product-1.jpeg',
    },
    {
      id: 2,
      name: 'Natural Honey',
      price: 'Rs. 950',
      image: '/product-2.jpeg',
    },
    {
      id: 3,
      name: 'Black Seed Powder',
      price: 'Rs. 1,500',
      image: '/prduct-3.jpeg',
    },
    {
      id: 4,
      name: 'Organic Syrup',
      price: 'Rs. 1,100',
      image: '/product-2.jpeg',
    },
    {
      id: 5,
      name: 'Herbal Capsules',
      price: 'Rs. 1,800',
      image: '/product-1.jpeg',
    },
    {
      id: 6,
      name: 'Skin Care Cream',
      price: 'Rs. 1,350',
      image: '/prduct-3.jpeg',
    },
  ]

  return (
    <section className="all-products-page page-fade-up">
      <div className="container">
        <div className="all-products-header fade-up fade-up-delay-1">
          <h1 className="all-products-title">Our Products</h1>
          <div className="all-products-title-line"></div>
        </div>

        <div className="all-products-grid">
          {products.map((product, index) => (
            <div
              className={`all-products-card fade-up fade-up-delay-${(index % 6) + 1}`}
              key={product.id}
            >
              <div className="all-products-image-wrap">
                <img
                  src={product.image}
                  alt={product.name}
                  className="all-products-image"
                />
              </div>

              <div className="all-products-content">
                <h3 className="all-products-name">{product.name}</h3>
                <p className="all-products-price">{product.price}</p>
                <button className="all-products-buy-btn">Buy</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Products