import React from "react";
import { motion } from "framer-motion";

function Travel() {
  const hotels = [
    {
      name: "Aloft New York Brooklyn",
      address: "216 Duffield St <br/> Brooklyn, NY 11201",
      image: "/images/aloft.jpeg",
      link: "https://www.marriott.com/event-reservations/reservation-link.mi?id=1740687509912&key=GRP&guestreslink2=true&app=resvlink",
      blockText: "Room block link",
      extraText: "*Room block is bookable until Sept. 11th",
    },
    {
      name: "EVEN Hotel Brooklyn",
      address: "46 Nevins St <br/> Brooklyn, NY 11217",
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/97/1b/80/even-hotel-brooklyn-an.jpg?w=1400&h=-1&s=1",
      link: "https://www.ihg.com/evenhotels/hotels/us/en/brooklyn/bxyev/hoteldetail",
    },
    {
      name: "Hampton Inn Brooklyn",
      address: "125 Flatbush Avenue Extension <br/> Brooklyn, NY, 11201",
      image:
        "https://images.trvl-media.com/lodging/9000000/8030000/8026900/8026859/7fc06626.jpg?impolicy=resizecrop&rw=1200&ra=fit",
      link: "https://www.hilton.com/en/hotels/nycbohx-hampton-brooklyn-downtown/",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "calc(100vh + 200px)",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Content wrapper to align title and hotel cards */}
      <div className="travelContainer">
        {/* Nearby Hotels Title */}
        <div style={{ marginBottom: 40 }}>
          <p
            className="responsive-align"
            style={{
              fontSize: 25,
              letterSpacing: 1,
              marginBottom: 2,
              fontWeight: 1000,
            }}
          >
            Nearby hotels
          </p>
          <p className="responsive-align" style={{ fontSize: 19 }}>
            We have a room block at the Brooklyn Aloft and have recommended some
            other nearby hotels.
          </p>
        </div>

        {/* Hotel Cards */}
        <div className="hotelCards">
          {hotels.map((hotel, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: 300,
                textAlign: "center",
              }}
            >
              {/* <img
                src={hotel.image}
                alt={hotel.name}
                style={{
                  width: 290,
                  height: 200,
                  objectFit: "cover",
                  objectPosition: "center",
                  borderRadius: 4,
                  filter: "grayscale(10%)",
                }}
              /> */}
              <div style={{ marginTop: 12 }}>
                <p className="section-title">
                  <a
                    target="_blank"
                    rel="noreferrer noopener"
                    href={hotel.link}
                    style={{ fontSize: 20, fontWeight: 450 }}
                  >
                    {hotel.name}
                  </a>
                </p>
                <p
                  className="section-subtitle"
                  dangerouslySetInnerHTML={{ __html: hotel.address }}
                />
                {hotel.blockText && (
                  <div>
                    <p
                      style={{
                        fontFamily: "EB Garamond",
                        fontSize: 18,
                        marginTop: -8,
                      }}
                    >
                      <a
                        target="_blank"
                        rel="noreferrer noopener"
                        href={hotel.link}
                        style={{
                          textDecoration: "underline",
                          fontWeight: 500,
                          // color: "#7b4046",
                        }}
                      >
                        {hotel.blockText}
                      </a>
                    </p>
                    <p style={{ marginTop: -12 }}>{hotel.extraText}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recommended Food */}
        <div style={{ marginTop: 60 }}>
          <div style={{ marginBottom: 40 }}>
            <p
              className="responsive-align"
              style={{
                fontSize: 25,
                letterSpacing: 1,
                marginBottom: 5,
                fontWeight: 1000,
              }}
            >
              Recommended food
            </p>
            <p className="responsive-align" style={{ fontSize: 19 }}>
              Some of our favorite restaurants and food spots nearby.
            </p>
          </div>
          <div>
            <iframe
              src="https://www.google.com/maps/d/embed?mid=1TobrCYOxj5nJ2hWlwCUilZB9q46ls2s&ehbc=2E312F"
              title="food-recommendations"
              style={{ width: "100%", height: 550 }}
            ></iframe>
          </div>
        </div>

        {/* Recommended Bars */}
        <div style={{ marginTop: 60 }}>
          <div style={{ marginBottom: 40 }}>
            <p
              className="responsive-align"
              style={{
                fontSize: 25,
                letterSpacing: 1,
                marginBottom: 5,
                fontWeight: 1000,
              }}
            >
              Recommended bars
            </p>
            <p className="responsive-align" style={{ fontSize: 19 }}>
              Some of our favorite restaurants and food spots nearby.
            </p>
          </div>
          <div>
            <iframe
              src="https://www.google.com/maps/d/embed?mid=11PkHSpinqHeAlI0Kct-iGcwisp6JAFg&ehbc=2E312F"
              title="bar-recommendations"
              style={{ width: "100%", height: 550 }}
            ></iframe>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Travel;
