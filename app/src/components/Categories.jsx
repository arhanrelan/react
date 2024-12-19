import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NewsCard from "./NewsCard";
import "../css/Categories.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Categories = ({ news }) => {
  const [rotate, setRotate] = useState(0);
  return (
    <details className="mt-3 " open>
      <summary
        className="d-flex align-items-center justify-content-between pl-2 pr-4 border rounded p-3 bg-light"
        onClick={() => setRotate(rotate + 45)}
      >
        <div className="title d-flex align-items-center gap-3">
          <FontAwesomeIcon icon={news.category.icon} className="fa_Icon" />
          <h3 className="mb-0">{news.category.label}</h3>
        </div>
        <div className="accordion-icon">
          <FontAwesomeIcon
            icon={faXmark}
            style={{ transform: `rotate(${rotate}deg)` }}
          />
        </div>
      </summary>

      {((news.articles && news.articles.length === 0) ||
        news.articles === undefined) && (
        <p className="text-muted d-flex justify-content-center">
          No article found!
        </p>
      )}

      

      {news.articles &&
        news.articles.length > 0 &&
        news.articles.map((data) => {
          return (
            <div key={data.url}>
              <NewsCard newsData={data} />
            </div>
          );
        })}
    </details>
  );
};

export default Categories;
