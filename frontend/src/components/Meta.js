import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};
Meta.defaultProps = {
  title: "Welcome To My Store",
  description: "We sell gadgets at the best prices",
  keywords: "gadgets, electronics, accessories",
};
export default Meta;