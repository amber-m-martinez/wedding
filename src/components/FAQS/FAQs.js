import React from "react";
import { motion } from "framer-motion";
import faqs from "../../api/faq.json";
import FAQ from "./FAQ";

function FAQs() {
  const FAQS = faqs.faq;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "calc(100vh + 400px)",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div className="faqList">
        {FAQS.map((faq, index) => (
          <FAQ key={index} faq={faq} />
        ))}
      </div>
    </motion.div>
  );
}

export default FAQs;
