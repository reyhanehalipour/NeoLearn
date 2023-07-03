import React from "react";
import AboutUsBox from "../AboutUsBox/AboutUsBox";
import SectionHeader from "./../SectionHeader/SectionHeader";

import "./AboutUs.css";

export default function AboutUs() {
  return (
    <div className="about-us">
      <div className="container">
        <SectionHeader
          title="ما چه کمکی بهتون میکنیم؟"
          desc="از اونجایی که آکادمی آموزشی نعولرن یک آکادمی خصوصی هست"
        />

        <div className="container">
          <div className="row">
          <AboutUsBox 
                    title=' دوره اختصاصی'
                     desc='با  پشتیبانی و  کیفت بالا'
                     icon='far fa-copyright about-us__icon'/>

                    <AboutUsBox
                     title='اجازه تدریس' 
                    desc='به هر کسی رو نمیده '
                    icon="fas fa-leaf about-us__icon"/>

                    <AboutUsBox 
                    title='دوره پولی و رایگان' 
                    desc=' براش  مهم نیست به مدرسش حقوق میده تا نهایت کیفیت رو در پشتیبانی اراعه بده'
                    icon='fas fa-gem about-us__icon'/>

                    <AboutUsBox 
                    title=' اهمیت به کاربر'
                     desc='مهم ترین  هدف اکادمی رسوندن کاربر به مرحله بازار کاره'
                     icon='fas fa-crown about-us__icon'/>
          </div>
        </div>
      </div>
    </div>
  );
}
