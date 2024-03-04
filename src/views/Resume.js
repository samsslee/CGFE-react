/*!

=========================================================
* Paper Dashboard React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import supabase from "config/supabaseClient";
import { useEffect, useState } from "react";

import ResumeEntry from "components/Elements/ResumeEntry";
import AddEntry from "components/Elements/AddEntry";

function Resume() {

  const [fetchError, setFetchError] = useState(null)
  const [entries, setEntries] = useState(null)
  const [orderBy, setOrderBy] = useState('end_date')

  useEffect(()=>{

    const fetchEntries = async ()=>{
      const {data, error} = await supabase
        .from('resume_entries')
        .select()
        .order(orderBy, {ascending: false})

        if(error) {
          setFetchError('could not fetch')
          console.log(error)
          setEntries(null)
        }
        if(data) {
          setEntries(data)
          setFetchError(null)
        }

    }

    fetchEntries()

  },[])

  return (
    <>
      <div className="content">
        {fetchError && (<p>{fetchError}</p>)}
        {entries && (
          <div>
            {entries.map(entry => (
              <ResumeEntry key = {entry.id} entry = {entry}/>
            ))}
            <AddEntry/>
          </div>
        )}
      </div>
    </>
  );
}

export default Resume;
