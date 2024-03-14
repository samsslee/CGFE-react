import React from "react";
import supabase from "config/supabaseClient";

import Collapsible from "components/Wrappers/Collapsible";

function CoverLetter() {
  
    return (
      <>
        <div className="content">
          <Collapsible label="Job Description"/>

        </div>
      </>
    );
  }
  
  export default CoverLetter;