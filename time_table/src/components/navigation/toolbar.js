import React from "react";

function Toolbar() {
  return (
    <div className="w-full h-16 bg-bck-4">
      <div className="w-5/6 mx-auto">
        <div className="w-1/2 text-lg md:text-2xl sm:w-2/3 sm:text-xl inline-block my-4 font-light">
          TIME TABLE GENERATOR
        </div>

        <div className="w-1/2 sm:w-1/3 inline-flex flex-row-reverse justify-between">
          <div className="sm:text-lg text-md font-light ">Help</div>
          <div className="sm:text-lg text-md font-light">Add</div>
          <div className="sm:text-lg text-md font-light">Create</div>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
