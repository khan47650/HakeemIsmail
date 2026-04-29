import "../css/Videos.css"
import { FaYoutube, FaFacebook } from "react-icons/fa"

function Videos() {
  const videos = [
    {
      id: 1,
      title: "Best Herbal Tips for Daily Health",
      platform: "YouTube",
      thumbnail: "/video-1.jpeg",
      url: "https://www.youtube.com/watch?v=your-video-id-1",
      duration: "12:45",
      description:
        "Useful herbal guidance and simple daily wellness tips for a healthier lifestyle.",
    },
    {
      id: 2,
      title: "How to Use Natural Honey Properly",
      platform: "Facebook",
      thumbnail: "/video-2.jpeg",
      url: "https://www.facebook.com/your-page/videos/your-video-id-2",
      duration: "08:20",
      description:
        "Learn the right way to use natural honey in your daily routine.",
    },
    {
      id: 3,
      title: "Benefits of Black Seed in Routine",
      platform: "YouTube",
      thumbnail: "/video-3.jpeg",
      url: "https://www.youtube.com/watch?v=your-video-id-3",
      duration: "10:05",
      description:
        "Explore the traditional benefits of black seed and its wellness uses.",
    },
    {
      id: 4,
      title: "Organic Lifestyle Tips for Better Health",
      platform: "Facebook",
      thumbnail: "/video-4.jpeg",
      url: "https://www.facebook.com/your-page/videos/your-video-id-4",
      duration: "07:40",
      description:
        "Easy organic lifestyle improvements that can make your routine better.",
    },
    {
      id: 5,
      title: "Simple Home Remedies You Should Know",
      platform: "YouTube",
      thumbnail: "/video-5.jpeg",
      url: "https://www.youtube.com/watch?v=your-video-id-5",
      duration: "09:30",
      description:
        "Common home remedies explained in a simple and practical way.",
    },
    {
      id: 6,
      title: "Skin Care with Natural Products",
      platform: "Facebook",
      thumbnail: "/video-4.jpeg",
      url: "https://www.facebook.com/your-page/videos/your-video-id-6",
      duration: "06:55",
      description:
        "Natural product based skin care guidance for a clean routine.",
    },
  ]

  return (
    <section className="lux-videos-page page-fade-up">
      <div className="container">
        <div className="lux-videos-header fade-up fade-up-delay-1">
          <h1 className="lux-videos-title">Our Videos</h1>
          <p className="lux-videos-subtitle">
            Explore our latest YouTube and Facebook videos for wellness
            guidance, natural health tips, and herbal awareness.
          </p>
          <div className="lux-videos-title-line"></div>
        </div>

        <div className="lux-videos-grid">
          {videos.map((video, index) => (
            <div
              className={`fade-up fade-up-delay-${(index % 6) + 1}`}
              key={video.id}
            >
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="lux-video-card"
              >
                <div className="lux-video-thumb-wrap">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="lux-video-thumb"
                  />
                  <span className="lux-video-duration">{video.duration}</span>
                </div>

                <div className="lux-video-content">
                  <h3 className="lux-video-card-title">{video.title}</h3>
                  <p className="lux-video-card-text">{video.description}</p>

                  <div className="lux-video-btn-wrap">
                    <span className={`lux-video-btn ${video.platform.toLowerCase()}`}>
                      {video.platform === "YouTube" ? (
                        <FaYoutube className="video-icon" />
                      ) : (
                        <FaFacebook className="video-icon" />
                      )}
                      <span className="btn-text">Watch Now</span>
                    </span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Videos;