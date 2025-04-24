import React from "react";
import { motion } from "framer-motion";

function Travel() {
  const hotels = [
    {
      name: "Ace Hotel Brooklyn",
      address: "252 Schermerhorn St <br> Brooklyn, NY 11217",
      image: "/images/hotels/ace-hotel.jpg",
      link: "https://reservations.acehotel.com/?&hotel=30176&arrive=2025-10-23&depart=2025-10-25&group=MALY1025",
      blockText: "Room block link",
      extraText: "Room block is bookable until Sept. 8th",
    },
    {
      name: "Aloft New York Brooklyn",
      address: "216 Duffield St <br/> Brooklyn, NY 11201",
      image: "/images/hotels/aloft-hotel.png",
      link: "https://www.marriott.com/event-reservations/reservation-link.mi?id=1740687509912&key=GRP&guestreslink2=true&app=resvlink",
      blockText: "Room block link",
      extraText: "Room block is bookable until Sept. 11th",
    },
    {
      name: "EVEN Hotel Brooklyn",
      address: "46 Nevins St <br/> Brooklyn, NY 11217",
      image: "/images/hotels/even-hotel.jpg",
      link: "add link pls",
      blockText: "Room block link",
      extraText: "Room block is bookable until Sept. 23rd",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 30,
      }}
    >
      <div className="travelContainer">
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
            Hotel Room Blocks
          </p>
          <p className="responsive-align" style={{ fontSize: 19 }}>
            We have room blocks at the following hotels between October
            23rd-25th.
          </p>
        </div>

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
              <div style={{ marginTop: 20 }}>
                <img
                  alt="hotel"
                  src={hotel.image}
                  style={{
                    width: 250,
                    height: 170,
                    objectFit: "cover",
                    borderRadius: 4,
                    marginBottom: 20,
                    border: "0.3px solid #e0e0e0",
                  }}
                ></img>
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
                        }}
                      >
                        {hotel.blockText}
                      </a>
                    </p>
                    <p>{hotel.extraText}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

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
              Some of our favorite restaurants and food spots in the city.
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
              Some of our favorite bars in the city.
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
