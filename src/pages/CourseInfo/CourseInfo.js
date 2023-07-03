import React, { useState, useEffect } from "react";
import Topbar from "./../../Components/Topbar/Topbar";
import Navbar from "./../../Components/Navbar/Navbar";
import Footer from "./../../Components/Footer/Footer";
import Breadcrumb from "../../Components/Breadcrumb/Breadcrumb";
import CourseDetailBox from "../../Components/CourseDetailBox/CourseDetailBox";
import CommentsTextArea from "../../Components/CommentsTextArea/CommentsTextArea";
import Accordion from "react-bootstrap/Accordion";
import { useParams, Link } from "react-router-dom";
import swal from "sweetalert";

import "./CourseInfo.css";

export default function CourseInfo() {
  const [comments, setComments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [courseDetails, setCourseDetails] = useState({});
  const [courseTeacher, setCourseTeacher] = useState({});
  const [courseCategory, setCourseCategory] = useState({});
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [cover, setcover] =useState([])
  const [diesc, setdiesc] =useState([])



  const { courseName } = useParams();

  useEffect(() => {
    
    getCourseDetails()

    
    fetch(`http://localhost:4000/v1/courses/related/${courseName}`)
      .then((res) => res.json())
      .then((allData) => {
        console.log(allData);
        setRelatedCourses(allData);
      });
   
  }, []); 
  
  function getCourseDetails() {
    const localStorageData = JSON.parse(localStorage.getItem("user"));

    fetch(`http://localhost:4000/v1/courses/${courseName}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          localStorageData === null ? null : localStorageData.token
        }`,
      },
    })
      .then((res) => res.json())
      .then((courseInfo) => {
        setComments(courseInfo.comments);
        setSessions(courseInfo.sessions);
        setCourseDetails(courseInfo);
        setCreatedAt(courseInfo.createdAt);
        setUpdatedAt(courseInfo.updatedAt);
        setCourseTeacher(courseInfo.creator);
        setCourseCategory(courseInfo.categoryID);
        setcover(courseInfo.cover)
        setdiesc(courseInfo.description)
      });
  }





  const submitComment = (newCommentBody,commentScore) => {
    const localStorageData = JSON.parse(localStorage.getItem("user"));

    fetch(`http://localhost:4000/v1/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorageData.token}`,
      },
      body: JSON.stringify({
        body: newCommentBody,
        courseShortName: courseName,
        score:commentScore
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        swal({
          title: "کامنت موردنظر با موفقیت ثبت شد",
          icon: "success",
          buttons: "تایید",
        });
      });
  };


  const registerInCourse = (course) => {
    if (course.price === 0) {
      swal({
        title: "آیا از ثبت نام در دوره اطمینان دارید؟",
        icon: "warning",
        buttons: ["نه", "آره"],
      }).then((result) => {
        if (result) {
          fetch(`http://localhost:4000/v1/courses/${course._id}/register`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).token
              }`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              price: course.price,
            }),
          }).then((res) => {
            console.log(res);
            if (res.ok) {
              swal({
                title: "ثبت نام با موفقیت انجام شد",
                icon: "success",
                buttons: "اوکی",
              }).then(() => {
                getCourseDetails();
              });
            }
          });
        }
      });
    } else {
      swal({
        title: "آیا از ثبت نام در دوره اطمینان دارید؟",
        icon: "warning",
        buttons: ["نه", "آره"],
      }).then((result) => {
        if (result) {
          swal({
            title: "در صورت داشتن کد تخفیف وارد کنید:",
            content: "input",
            buttons: ["ثبت نام بدون کد تخفیف", "اعمال کد تخفیف"],
          }).then((code) => {
            if (code === null) {
              fetch(`http://localhost:4000/v1/courses/${course._id}/register`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${
                    JSON.parse(localStorage.getItem("user")).token
                  }`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  price: course.price,
                }),
              }).then((res) => {
                console.log(res);
                if (res.ok) {
                  swal({
                    title: "ثبت نام با موفقیت انجام شد",
                    icon: "success",
                    buttons: "اوکی",
                  }).then(() => {
                    getCourseDetails();
                  });
                }
              });
            } else {
              fetch(`http://localhost:4000/v1/offs/${code}`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${
                    JSON.parse(localStorage.getItem("user")).token
                  }`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  course: course._id,
                }),
              })
                .then((res) => {
                  console.log(res);

                  if (res.status == 404) {
                    swal({
                      title: "کد تخفیف معتبر نیست",
                      icon: "error",
                      buttons: "ای بابا",
                    });
                  } else if (res.status == 409) {
                    swal({
                      title: "کد تخفیف قبلا استفاده شده :/",
                      icon: "error",
                      buttons: "ای بابا",
                    });
                  } else {
                    return res.json();
                  }
                })
                .then((code) => {
                  fetch(
                    `http://localhost:4000/v1/courses/${course._id}/register`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${
                          JSON.parse(localStorage.getItem("user")).token
                        }`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        price:
                          course.price - (course.price * code.percent) / 100,
                      }),
                    }
                  ).then((res) => {
                    console.log(res);
                    if (res.ok) {
                      swal({
                        title: "ثبت نام با موفقیت انجام شد",
                        icon: "success",
                        buttons: "اوکی",
                      }).then(() => {
                        getCourseDetails();
                      });
                    }
                  });
                });
            }
          });
        }
      });
    }
  };

  return (
    <>
      <Topbar />
      <Navbar />

      <Breadcrumb
        links={[
          { id: 1, title: "خانه", to: "" },
          {
            id: 2,
            title: "آموزش برنامه نویسی فرانت‌اند",
            to: "category-info/frontend",
          },
          {
            id: 3,
            title: "دوره متخصص جاوا اسکریپت",
            to: "course-info/js-expert",
          },
        ]}
      />

      <section className="course-info">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <a href="#" className="course-info__link">
               
              </a>
              <h1 className="course-info__title">{courseDetails.name}</h1>
              <p className="course-info__text">{courseDetails.description}</p>
              <div className="course-info__social-media">
                <a href="#" className="course-info__social-media-item">
                  <i className="fab fa-telegram-plane course-info__icon"></i>
                </a>
                <a href="#" className="course-info__social-media-item">
                  <i className="fab fa-twitter course-info__icon"></i>
                </a>
                <a href="#" className="course-info__social-media-item">
                  <i className="fab fa-facebook-f course-info__icon"></i>
                </a>
              </div>
            </div>

            <div className="col-6">
             <img src={cover}/>
            </div>
          </div>
        </div>
      </section>

      <main className="main">
        <div className="container">
          <div className="row">
            <div className="col-8">
              <div className="course">
                <div className="course-boxes">
                  <div className="row">
                    <CourseDetailBox
                      icon="graduation-cap"
                      title="وضعیت دوره:"
                      text={
                        courseDetails.isComplete === 1
                          ? "به اتمام رسیده"
                          : "در حال برگزاری"
                      }
                    />
                    <CourseDetailBox
                      icon="clock"
                      title="زمان برگزاری"
                      text={createdAt}
                    />
                    <CourseDetailBox
                      icon="calendar-alt"
                      title="آخرین بروزرسانی:"
                      text={updatedAt}
                    />
                  </div>
                </div>
                {/* Start Course Progress */}
              
               
                {/* Finish Course Progress */}

                {/* Start Introduction */}

                <div className="introduction">
                  <div className="introduction__item">
                
                    <img
                      src="/images/info/1.gif"
                      alt="course info image"
                      className="introduction__img img-fluid"
                    />
                    <p className="introduction__text">
                    {diesc}
                    </p>
                    
                  </div>
                  <div className="introduction__item">
                    
                    <img
                      src={cover}
                      alt="course info image"
                      className="introduction__img img-fluid"
                    />
                
                  
                  
                    
                  </div>
                
                  <div className="introduction__topic">
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item eventKey="0" className="accordion">
                        <Accordion.Header>جلسات دوره</Accordion.Header>
                        {sessions.map((session, index) => (
                          <Accordion.Body
                            key={session._id}
                            className="introduction__accordion-body"
                          >
                            {session.free === 1 ||
                            courseDetails.isUserRegisteredToThisCourse ? (
                              <>
                                <div className="introduction__accordion-right">
                                  <span className="introduction__accordion-count">
                                    {index + 1}
                                  </span>
                                  <i className="fab fa-youtube introduction__accordion-icon"></i>
                                  <Link
                                    to={`/${courseName}/${session._id}`}
                                    className="introduction__accordion-link"
                                  >
                                    {session.title}
                                  </Link>
                                </div>
                                <div className="introduction__accordion-left">
                                  <span className="introduction__accordion-time">
                                    {session.time}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="introduction__accordion-right">
                                  <span className="introduction__accordion-count">
                                    {index + 1}
                                  </span>
                                  <i className="fab fa-youtube introduction__accordion-icon"></i>
                                  <span
                                    className="introduction__accordion-link"
                                  >
                                    {session.title}
                                  </span>
                                </div>
                                <div className="introduction__accordion-left">
                                  <span className="introduction__accordion-time">
                                    {session.time}
                                  </span>
                                  <i className="fa fa-lock"></i>
                                </div>
                              </>
                            )}
                          </Accordion.Body>
                        ))}
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </div>
                {/* Finish Introduction */}

                {/* Start Teacher Details */}

                <div className="techer-details">
                  <div className="techer-details__header">
                    <div className="techer-details__header-right">
                      <img
                        src="/images/me2.jpg"
                        alt="Teacher Profile"
                        className="techer-details__header-img"
                      />
                      <div className="techer-details__header-titles">
                        <a href="#" className="techer-details__header-link">
                          
                          {courseTeacher.name}
                        </a>
                        <span className="techer-details__header-skill">
                          Front End & Back End Developer
                        </span>
                      </div>
                    </div>
                    <div className="techer-details__header-left">
                      <i className="fas fa-chalkboard-teacher techer-details__header-icon"></i>
                      <span className="techer-details__header-name">مدرس</span>
                    </div>
                  </div>
                  <p className="techer-details__footer">
                    اول از همه برنامه نویسی اندروید رو شروع کردم و نزدیک به 2
                    سال با زبان جاوا اندروید کار میکردم .بعد تصمیم گرفتم در
                    زمینه وب فعالیت داشته باشم.و..
                  </p>
                </div>

                {/* Finish Teacher Details */}

                <CommentsTextArea
                  comments={comments}
                  submitComment={submitComment}
                />
              </div>
            </div>

            <div className="col-4">
              <div className="courses-info">
                <div className="course-info">
                  <div className="course-info__register">
                    {courseDetails.isUserRegisteredToThisCourse === true ? (
                      <span className="course-info__register-title">
                        <i className="fas fa-graduation-cap course-info__register-icon"></i>
                        دانشجوی دوره هستید
                      </span>
                    ) : (
                      <span className="course-info__register-title"
                      
  
                      onClick={() => registerInCourse(courseDetails)}>
                        ثبت نام در دوره
                      </span>
                    )}
                  </div>
                </div>
                <div className="course-info">
                  <div className="course-info__total">
                    <div className="course-info__top">
                      <div className="course-info__total-sale">
                        <i className="fas fa-user-graduate course-info__total-sale-icon"></i>
                        <span className="course-info__total-sale-text">
                          تعداد دانشجو :
                        </span>
                        <span className="course-info__total-sale-number">
                          {courseDetails.courseStudentsCount}
                        </span>
                      </div>
                    </div>
                    <div className="course-info__bottom">
                      <div className="course-info__total-comment">
                        <i className="far fa-comments course-info__total-comment-icon"></i>
                        <span className="course-info__total-comment-text">
                          67 دیدگاه
                        </span>
                      </div>
                      <div className="course-info__total-view">
                        <i className="far fa-eye course-info__total-view-icon"></i>
                        <span className="course-info__total-view-text">
                          14,234 بازدید
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="course-info">
                  <div className="course-info__header-short-url">
                    <i className="fas fa-link course-info__short-url-icon"></i>
                    <span className="course-info__short-url-text">
                      لینک کوتاه
                    </span>
                  </div>
               
                </div>
                <div className="course-info">
                  <span className="course-info__topic-title">
                    سرفصل های دوره
                  </span>
                  <span className="course-info__topic-text">
                    برای مشاهده و یا دانلود دوره روی کلمه
                    <a href="#" style={{ color: "blue", fontWeight: "bold" }}>
                      لینک
                    </a>
                    کلیک کنید
                  </span>
                </div>

                {relatedCourses.length !== 0 && (
                  <div className="course-info">
                    <span className="course-info__courses-title">
                      دوره های مرتبط
                    </span>
                    <ul className="course-info__courses-list">
                      {relatedCourses.map((course) => (
                        <li className="course-info__courses-list-item">
                          <Link
                            to={`/course-info/${course.shortName}`}
                            className="course-info__courses-link"
                          >
                            <img
                              src={`http://localhost:4000/courses/covers/${course.cover}`}
                              alt="Course Cover"
                              className="course-info__courses-img"
                            />
                            <span className="course-info__courses-text">
                              {course.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
