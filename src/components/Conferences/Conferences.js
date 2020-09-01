import React, { useState, useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";

import styles from "./Conferences.module.css";

const Conferences = () => {
  const [searchConf, setSearchConf] = useState("");
  const [filter, setFilter] = useState("all");
  const [filterText, setFilterText] = useState("");
  const [allConferences, setAllConferences] = useState([]);
  const [conferencesToShow, setConferencesToShow] = useState([]);

  const handleConfSearchInput = (event) => {
    setSearchConf(event.target.value);
  };

  const handleFilterText = (event) => {
    setFilterText(event.target.value);
  };

  const handleFilterOption = (event) => {
    setFilter(event.target.value);
  };

  const handleFilter = (arg) => {
    const filteredConferences = allConferences.filter((conference) => {
      switch (arg) {
        case "confStartDate": {
          return conference[arg]
            .split(" ")[1]
            .slice(0, 3)
            .toLowerCase()
            .includes(filterText.toLowerCase());
        }
        case "all": {
          return true;
        }
        default: {
          return conference[arg]
            .toLowerCase()
            .includes(filterText.toLowerCase());
        }
      }
    });
    setConferencesToShow(filteredConferences);
  };

  useEffect(() => {
    const getConferences = async () => {
      try {
        const response = await fetch(
          "https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences"
        );
        const jsonResponse = await response.json();
        setAllConferences(jsonResponse.paid.concat(jsonResponse.free));
        setConferencesToShow(jsonResponse.paid.concat(jsonResponse.free));
      } catch (error) {
        console.log(error);
      }
    };
    getConferences();
  }, []);

  return (
    <div className={styles.conferencesWrapper}>
      <nav className={styles.header}>
        <div className={styles.heading}>KonfHub Conferences</div>
        <form className={styles.searchBox}>
          <SearchIcon
            style={{
              verticalAlign: "middle",
              color: "#6464d8",
              marginLeft: ".75rem",
            }}
          />
          <input
            type="text"
            name="search"
            value={searchConf}
            onChange={handleConfSearchInput}
            placeholder="Search Conferences by name or city"
            autoComplete="off"
            className={styles.searchInput}
          />
        </form>
        <div className={styles.filterBox}>
          <p>Filter results by &nbsp;</p>
          <select
            value={filter}
            onChange={handleFilterOption}
            className={styles.filterSelect}
          >
            <option value="all">All</option>
            <option value="city">City</option>
            <option value="confStartDate">Month</option>
            <option value="entryType">Entry Fee</option>
            <option value="country">Country</option>
          </select>
          <input
            type="text"
            name="filter"
            value={filterText}
            onChange={handleFilterText}
            className={styles.filterText}
          />
          <button
            className={styles.filterBtn}
            onClick={handleFilter.bind(null, filter)}
          >
            Filter
          </button>
        </div>
      </nav>
      <div className={styles.conferencesContainer}>
        {conferencesToShow
          .filter((conference) => {
            return (
              conference.city
                .toLowerCase()
                .includes(searchConf.toLowerCase()) ||
              conference.confName
                .toLowerCase()
                .includes(searchConf.toLowerCase())
            );
          })
          .map((conference, index) => {
            return (
              <div
                key={conference.conference_id + index}
                className={styles.conference}
              >
                <div className={styles.entryType}>{conference.entryType}</div>
                <div className={styles.confImage}>
                  <img
                    src={
                      conference.imageURL.startsWith('""')
                        ? conference.imageURL.slice(1, -1)
                        : conference.imageURL
                    }
                    alt={conference.confName}
                  />
                </div>
                <div>
                  <div className={styles.mainInfo}>
                    <h1>{conference.confName}</h1>
                    <h2>
                      {conference.city}, {conference.country}
                    </h2>
                  </div>
                  <p>Date - {conference.confStartDate}</p>
                </div>
                <div className={styles.linkArea}>
                  <a href={conference.confUrl} target="new">Visit</a>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Conferences;
