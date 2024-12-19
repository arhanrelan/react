import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { baseURL, categories as categoriesList } from "../utilities/constants";
import "../css/Headlines.css";
import Filters from "./Filters";
import FollowedArticles from "./FollowedArticles";
import Categories from "./Categories";
import { hasFollowedNews } from "../utilities/helper";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

const Index = () => {
  // write task 3 state here(useState)
  const [date,setDate] = useState();  
  const [country, setCountry] = useState();
  const [categories, setCategories] = useState([]);
  const [news,setNews] = useState(null);
  const handleDateChange = (value) => {
    setDate(value);
  };
  const handleCountryChange = (value) => {
    setCountry(value);
  };
  const handleCategoriesChange = (value) => {
    setCategories(value);
  };
  // write task 4 solution here
  useEffect(() => {
      let urls = [];
      const apiKey=`&apiKey=${process.env.REACT_APP_NEWS_KEY}`;
      
        let paramCountry = country ? `&country=${country.value}` : "&country=us";

  let paramFrom = "";
  let paramTo = "";
  
  // Date range selected
  if (Array.isArray(date)) {
    const today = new Date();
    if (date[1].setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0)) {
    } else {
      const fromDate = new Date(date[0]);
      const toDate = new Date(date[1]);
      paramFrom = `from=${fromDate.toISOString()}`;
      paramTo = `&to=${toDate.toISOString()}`;
      
      // News category selected
      if (categories?.length) {
        categories.forEach((category) => {
          const paramCategory = `&category=${category.value}`;
          urls.push(
            `${baseURL}/top-headlines/sources?${
              paramFrom + paramTo + paramCategory + paramCountry + apiKey
            }`
          );
        });
      } else { // No news category selected
        urls.push(`${baseURL}/top-headlines/sources?${paramFrom + paramTo + paramCountry + apiKey}`);
      }
    }
  } else { // no date range selected
    // News category selected
    if (categories?.length) {
      categories.forEach((category) => {
        const paramCategory = `&category=${category.value}`;
        urls.push(
          `${baseURL}/top-headlines?pageSize=10${
            paramCategory + paramCountry + apiKey
          }`
        );
      });
    } else { // No news category selected
      urls.push(
        `${baseURL}/top-headlines?pageSize=10${paramCountry + apiKey}`
      );
    }

  }
  let categoryNews = [];
urls.forEach(async (url) => {
  const response = await fetch(url).then((res) => res.json());

  if (response.hasOwnProperty("sources")) {
    let sources = "&sources=";
    for (let i = 0; i < response.sources.length; i++) {
      if (i === 19 || i === response.sources.length) {
        sources += response.sources[i].id;
        break;
      } else {
        sources += response.sources[i].id + ",";
      }
    }
    const articles = await fetch(
      `${baseURL}/everything?pageSize=10${sources + paramFrom + paramTo + apiKey}`
    ).then((res) => res.json());

    getResponseAndSetState(articles, url);
  } else {
    getResponseAndSetState(response, url);
  }
});

function getResponseAndSetState(res, url) {
  const urlParams = new URLSearchParams(url.split("?")[2]);
  let category = urlParams.get("category");
  
  if (category) {
    category = categoriesList.filter(
      (category) => category.value === urlParams.get("category")
    );
    category = category[0];
  } else {
    category = {
      label: "Headlines",
      value: "breaking-news",
      icon: faNewspaper,
    };
  }
  
  let tmpCategoryNews = {
    category,
    articles: res.articles,
  };

  categoryNews = [...categoryNews, tmpCategoryNews];
  setNews(categoryNews);
}
  },[date,country,categories]); 
  // Write task 11 Create state solution

  return (
    <Container className="main_container my-5">
      <Row className="col-xxl-10 mx-auto">
        <h1>News Portal</h1>
        <Filters 
            handleDateChange={handleDateChange}
            handleCountryChange={handleCountryChange}
            handleCategoriesChange={handleCategoriesChange}
        />
               

        {
         news &&
  news.map((categoryNews) => {
    return (
      <Categories
        key={categoryNews.category.value}
        news={categoryNews}
      />
    );
  })
          /* write task 6 here */
        }
        
        {
         hasFollowedNews() && <FollowedArticles />


          /* write task 10 here */
        }

      </Row>
    </Container>
  );
};

export default Index;

