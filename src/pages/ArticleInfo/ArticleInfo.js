import React, { useEffect, useState } from "react";
import Topbar from "./../../Components/Topbar/Topbar";
import Navbar from "./../../Components/Navbar/Navbar";
import Footer from "./../../Components/Footer/Footer";
import Breadcrumb from "./../../Components/Breadcrumb/Breadcrumb";
import domPurify from 'dompurify'

import "./ArticleInfo.css";

import { useParams } from "react-router-dom";

export default function ArticleInfo() {




  const [articleDetails, setArticleDetails] = useState({});
  const [articleCategory, setArticleCategory] = useState({});
  const [articleCreator, setArticleCreator] = useState({});
  const [articleCreateDate, setArticleCreateDate] = useState("");
  const [articlecover, setArticlecover] = useState({});
  const { articleName } = useParams();

  useEffect(() => {
    fetch(`http://localhost:4000/v1/articles/${articleName}`)
      .then((res) => res.json())
      .then((articleInfo) => {
        console.log('articlinfo =>', articleInfo.cover)
     
        setArticleDetails(articleInfo);
        setArticleCategory(articleInfo.categoryID);
        setArticleCreator(articleInfo.creator);
        setArticleCreateDate(articleInfo.createdAt);
        setArticlecover(articleInfo.cover)
        
     
      });
  }, []);


  return (
    <>
      <Topbar />
      <Navbar />

      <Breadcrumb
        links={[
          { id: 1, title: "خانه", to: "" },
          {
            id: 2,
            title: "مقاله ها",
            to: "category-info/frontend",
          },
          {
            id: 3,
            title: "ویو Vs ری‌اکت",
            to: "course-info/js-expert",
          },
        ]}
      />

      <main className="main">
        <div className="container">
          <div className="row">
            <div className="col-8">
              <div className="article">
                <h1 className="article__title">{articleDetails.name}</h1>
                <div className="article__header">
                  <div className="article-header__category article-header__item">
                    <i className="far fa-folder article-header__icon"></i>
                    <a href="#" className="article-header__text">
                      {articleCategory.name}
                    </a>
                  </div>
                  <div className="article-header__category article-header__item">
                    <i className="far fa-user article-header__icon"></i>
                    <span className="article-header__text">
                      ارسال شده توسط {articleCreator.name}
                    </span>
                  </div>
                  <div className="article-header__category article-header__item">
                    <i className="far fa-eye article-header__icon"></i>
                    <span className="article-header__text">
                      تاریخ انتشار: {articleCreateDate.slice(0, 10)}
                    </span>
                  </div>
                </div>
                <img
                  src={articlecover}
                  alt="Article Cover"
                  className="article__banner"
                />
                <div className="article__score">
                  <div className="article__score-icons">
                    <img
                      src="/images/svgs/star_fill.svg"
                      className="article__score-icon"
                    />
                    <img
                      src="/images/svgs/star_fill.svg"
                      className="article__score-icon"
                    />
                    <img
                      src="/images/svgs/star_fill.svg"
                      className="article__score-icon"
                    />
                    <img
                      src="/images/svgs/star_fill.svg"
                      className="article__score-icon"
                    />
                    <img
                      src="/images/svgs/star.svg"
                      className="article__score-icon"
                    />
                  </div>
                  <span className="article__score-text">
                    4.2/5 - (5 امتیاز)
                  </span>
                </div>



             
                
                <div className="article-section" 
                dangerouslySetInnerHTML={{ __html: domPurify.sanitize(articleDetails.body) }}>
                
                </div>

              </div>

             
            </div>
            <div className="col-4">
              
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
