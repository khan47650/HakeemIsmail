import "../css/Shorts.css"
import { FaYoutube, FaFacebook } from "react-icons/fa"

function Shorts() {
  const shorts = [
    {
      id: 1,
      title: "Powerful Herbal Tips for Daily Life",
      thumbnail: "/short-1.jpeg",
      duration: "0:42",
      url: "https://www.youtube.com/shorts/your-short-id-1",
    },
    {
      id: 2,
      title: "Natural Honey Benefits You Should Know",
      thumbnail: "/short-2.jpeg",
      duration: "0:35",
      url: "https://www.youtube.com/shorts/your-short-id-2",
    },
    {
      id: 3,
      title: "Black Seed Routine Guide",
      thumbnail: "/short-3.jpeg",
      duration: "0:51",
      url: "https://www.facebook.com/reel/your-reel-id-1",
    },
    {
      id: 4,
      title: "Quick Organic Lifestyle Tips",
      thumbnail: "/short-4.jpeg",
      duration: "0:29",
      url: "https://www.youtube.com/shorts/your-short-id-3",
    },
    {
      id: 5,
      title: "Natural Skin Care in Simple Steps",
      thumbnail: "/short-5.jpeg",
      duration: "0:47",
      url: "https://www.facebook.com/reel/your-reel-id-2",
    },
    {
      id: 6,
      title: "Simple Home Remedy Short Guide",
      thumbnail: "/short-6.jpeg",
      duration: "0:38",
      url: "https://www.youtube.com/shorts/your-short-id-4",
    },
  ]

  const getPlatform = (url) => {
    return url.includes("facebook") ? "facebook" : "youtube"
  }

  return (
    <section className="shorts-showcase-page page-fade-up">
      <div className="container">
        <div className="shorts-showcase-header fade-up fade-up-delay-1">
          <h1 className="shorts-showcase-title">Our Shorts</h1>
          <p className="shorts-showcase-subtitle">
            Watch quick and engaging short videos filled with wellness tips,
            herbal awareness, and natural lifestyle guidance.
          </p>
          <div className="shorts-showcase-line"></div>
        </div>

        <div className="shorts-showcase-grid">
          {shorts.map((short, index) => {
            const platform = getPlatform(short.url)

            return (
              <div
                className={`fade-up fade-up-delay-${(index % 6) + 1}`}
                key={short.id}
              >
                <a
                  href={short.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shorts-showcase-card"
                >
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="shorts-showcase-thumb"
                  />

                  <div className="shorts-showcase-overlay"></div>

                  <span className="shorts-showcase-duration">
                    {short.duration}
                  </span>

                  <div className="shorts-showcase-content">
                    <h3 className="shorts-showcase-card-title">
                      {short.title}
                    </h3>

                    <div className="shorts-showcase-btn-wrap">
                      <span className={`shorts-showcase-btn ${platform}`}>
                        {platform === "youtube" ? (
                          <FaYoutube className="short-platform-icon" />
                        ) : (
                          <FaFacebook className="short-platform-icon" />
                        )}
                        <span>Watch Now</span>
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Shorts;