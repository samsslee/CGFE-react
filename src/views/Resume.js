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
      return prevEntries.filter(entry => entry.id != id)
    })
  }

  useEffect(()=>{
    const fetchEntries = async () => {
      //console.log("resume.js useEffect fired", Date.now())
      try {
        const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/graphql/v1`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.REACT_APP_ANON_KEY
          },
          body: JSON.stringify({
            query: `
              query{
                resume_entriesCollection{
                  edges{
                    node{
                      id,
                      position_title,
                      company_name,
                      start_date,
                      end_date
                      resume_description_embeddingsCollection{
                        edges{
                          node{
                            id,
                            description
                          }
                        }
                      }
                    }
                  }
                }
              }
            `
          })
        });

        const {data} = await response.json();
        let dbEntries = data.resume_entriesCollection.edges.map(item => {
          item.node.descriptionWids = []
          for (let edge of item.node.resume_description_embeddingsCollection.edges) {
            item.node.descriptionWids.push({
              description_id: edge.node.id,
              description: edge.node.description,
            });
          }
          delete item.node.resume_description_embeddingsCollection;
          return item.node;
        });
        setEntries(dbEntries)
      } catch (error) {
        //console.log(error)
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
              <ResumeEntry key = {entry.id} entry = {entry} onDelete = {handleDelete}/>
            ))}
            <AddEntry onCreate = {handleCreate}/>
          </div>
        )}
      </div>
    </>
  );
}

export default Resume;
