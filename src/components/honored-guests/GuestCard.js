import React from "react";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";

function GuestCard({ data }) {
  return (
    <div>
      <div style={{ marginBottom: 15, textAlign: "center" }}>
        <Image
          src={data.photo}
          roundedCircle
          style={{
            height: 200,
            width: 200,
            objectFit: "cover",
            border: ".2px solid #742935",
            borderRadius: 8,
          }}
        />
      </div>
      <Card
        style={{
          width: "100%",
          maxWidth: "18rem",
          margin: "0 auto",
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        <Card.Body>
          <div style={{ textAlign: "center" }}>
            <Card.Title
              style={{
                fontFamily: "Monsieur La Doulaise",
                fontSize: 30,
              }}
            >
              {data.name}
            </Card.Title>
            <Card.Text style={{ fontFamily: "EB Garamond", fontSize: 18 }}>
              {data.role}
            </Card.Text>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default GuestCard;
