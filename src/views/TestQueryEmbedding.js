import React from "react";
import supabase from "config/supabaseClient";

import QueryCard from "components/Elements/QueryCard";
import EmbeddingsCard from "components/Elements/AddEmbeddingsCard";

function TestQueryPage() {
  
    return (
      <>
        <div className="content">
          <p>Content Here</p>
          <QueryCard/>
          <EmbeddingsCard/>
        </div>
      </>
    );
  }
  
  export default TestQueryPage;