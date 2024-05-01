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
import { useEffect, useState } from "react";

import ResumeEntry from "components/Elements/ResumeEntry";
import AddEntry from "components/Elements/AddEntry";
import supabase from "config/supabaseClient";

function Resume() {

  const [fetchError, setFetchError] = useState(null)
  const [entries, setEntries] = useState(null)
  //const [orderBy, setOrderBy] = useState('start_date')

  const handleCreate = (entry) =>{
    setEntries(prevEntries => {
      // Check if entries is null or undefined
      if (!prevEntries) {
        return [entry]
      } else {
        // If entries already has data, append the new entry to the existing array
        return [...prevEntries, entry];
      }
    });
  }

  const handleDelete = (id) => {
    setEntries(prevEntries => {
      return prevEntries.filter(entry => entry.entry_id != id)
    })
  }

  useEffect(()=>{
    const fetchEntries = async () => {
      //fix error handling here in the try catch
      try {
        const { data, error } = await supabase
        .from('resume_entries')
        .select(`
          entry_id,
          position_title,
          company_name,
          start_date,
          end_date,
          resume_descriptions (description_id, description)
        `)
        setEntries(data)
      } catch (error) {
        console.log(error)
        setFetchError("there was a problem fetching your resume entries")
      }
    };

    fetchEntries();

  },[])

  return (
    <>
      <div className="content">
        {fetchError && (<p>{fetchError}</p>)}
        {entries && (
          <div>
            {entries.map(entry => (
              <ResumeEntry key = {entry.entry_id} entry = {entry} onDelete = {handleDelete}/>
            ))}
            <AddEntry onCreate = {handleCreate}/>
          </div>
        )}
      </div>
    </>
  );
}

export default Resume;
