import '../css/Home.css'

function Home() {
  const products = [
    {
      id: 1,
      name: 'Herbal Product',
      image: '/product-1.jpeg',
    },
    {
      id: 2,
      name: 'Herbal Product',
      image: '/product-2.jpeg',
    },
    {
      id: 3,
      name: 'Herbal Product',
      image: '/prduct-3.jpeg',
    },
    {
      id: 4,
      name: 'Herbal Product',
      image: '/product-2.jpeg',
    },
    {
      id: 5,
      name: 'Herbal Product',
      image: '/prduct-3.jpeg',
    },
    {
      id: 6,
      name: 'Herbal Product',
      image: '/product-1.jpeg',
    },
  ]

  return (
    <main className="home-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="home-info-card">
              <div className="row align-items-center g-4">
                <div className="col-lg-4 col-md-5 col-12">
                  <div className="hakeem-image-box">
                    <img
                      src="/hakeem.jpeg"
                      alt="Hakeem Ismail"
                      className="hakeem-image"
                    />
                  </div>
                </div>

                <div className="col-lg-8 col-md-7 col-12">
                  <div className="hakeem-content">
                    <h2 className="hakeem-name">
                      Hakeem Muhammad Ismail
                    </h2>
                    <p className="hakeem-subtitle">
                      Specialist in Unani Single-Organ Therapy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="popular-products-section">
          <div className="row">
            <div className="col-12">
              <h2 className="section-heading">Our Popular Products</h2>
               <div className="products-title-line"></div>
            </div>
          </div>

          <div className="row g-4">
            {products.map((product) => (
              <div key={product.id} className="col-lg-4 col-md-6 col-12">
                <div className="product-card">
                  <div className="product-image-box">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>

                  <div className="product-content">
                    <h3 className="product-name">{product.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home