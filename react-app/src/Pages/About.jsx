import React from "react";

export default function About() {
  return (
    <div>
      <div className="welcome">
        <div className="welcome-img">
          <img src="/images/aboutethiopia.jpg"></img>
        </div>
        <div className="welcome-text">
          <h1>Welcome to Abyssinia Restaurant</h1>
          <p>
            A place where culture meets authenticity. We intend on promoting our
            culture through our food.
          </p>
        </div>
      </div>
      <div className="about">
        <div className="about-text">
          <h1>About Us</h1>
          <p>
            Abyssinia is a restaurant based on Addis Ababa, Ethiopia. The name
            represents our identity, which is the former name of our country.{" "}
          </p>
        </div>
        <div className="about-img">
          <img src="/images/ethio.jpg"></img>
        </div>
      </div>
      <div className="vision">
        <div className="about-img">
          <img src="/images/ethio.jpg"></img>
        </div>
        <div className="Vision-text">
          <h1>Our Vision</h1>
          <p>
            To establish a global image with our exceptional food experience.
          </p>
        </div>
      </div>
    </div>
  );
}
