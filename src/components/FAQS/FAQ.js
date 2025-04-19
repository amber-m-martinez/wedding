import React from "react";

function FAQ({ faq }) {
  return (
    <div style={{ marginBottom: 35 }}>
      <h2 style={{ fontSize: 25, fontWeight: 700 }}>{faq.question}</h2>
      <div
        className="faq-answer"
        style={{
          fontFamily: "EB Garamond",
          fontSize: 18,
          whiteSpace: "pre-line",
        }}
        dangerouslySetInnerHTML={{ __html: faq.answer }}
      ></div>
    </div>
  );
}

export default FAQ;
