import React from "react";
import gmail from "../../assets/images/gmail.png";
import github from "../../assets/images/github.png";
import linkedin from "../../assets/images/linkedin.png";

function Footer() {
  return (
    <div className="w-full h-auto bg-bck-3">
      <div className="w-5/6 mx-auto ">
        <div className="w-2/3 text-lg sm:w-3/4 inline-block my-2 font-light">
          copyright@ IIITV
        </div>

        <div className="w-1/3 sm:w-1/4 inline-flex flex-row-reverse justify-between relative top-1">
          {/* <a href="https://github.com/DARKMAN-5">
            <img src={github} alt="github" className="w-6" />
          </a> */}

          <a href="mailto: paragthakre53@gmail.com">
            <img src={gmail} alt="gmail" className="w-6" />
          </a>

          <a href="https://www.linkedin.com/in/parag-thakre-4688a31ab/">
            <img src={linkedin} alt="linkedin" className="w-6" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
