import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { fetchPins } from "../../redux/pinReducer";
import PinItemsSearchBar from "../Pins/PinItemsSearchBar";
import SearchQuery from "./SearchQuery";

import "./SearchBar.css";

function SearchBar() {
  const dispatch = useDispatch();
  const [dropDown, setDropDown] = useState(false);
  const [query, setQuery] = useState("");
  const [searchedPins, setSearchedPins] = useState([]);

  const pins = useSelector((state) => state.pin.allPins);

  useEffect(() => {
    dispatch(fetchPins());
  }, [dispatch]);

  const pinsArray = pins ? Object.values(pins) : [];


  const getPinsGroupedByTags = () => {
    const pinsByTags = new Map();
    const pinsWithoutTags = [];

    pinsArray.forEach((pin) => {
      if (pin.tags && pin.tags.length > 0) {
        const firstTag = pin.tags[0]?.name;
        if (firstTag && !pinsByTags.has(firstTag)) {
          pinsByTags.set(firstTag, pin);
        }
      } else {
        pinsWithoutTags.push(pin);
      }
    });

    return {
      pinsWithTags: Array.from(pinsByTags.values()),
      pinsWithoutTags,
    };
  };

  const { pinsWithTags, pinsWithoutTags } = getPinsGroupedByTags();

  const combinedPins = [...pinsWithTags, ...pinsWithoutTags].slice(0, 12);

  useEffect(() => {
    if (query) {
      const lowerCaseQuery = query.toLowerCase();

      const filteredPins = pinsArray.filter((pin) => {
        const titleMatches = pin.title?.toLowerCase().includes(lowerCaseQuery) ?? false;

        const tags = Array.isArray(pin.tags) ? pin.tags : [];
        const tagsMatch = tags
          .filter((tag) => typeof tag.name === "string")
          .some((tag) => tag.name.toLowerCase().includes(lowerCaseQuery));

        return titleMatches || tagsMatch;
      });

      setSearchedPins(filteredPins);
    } else {
      setSearchedPins([]);
    }
  }, [query, pinsArray]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSuggestionWord = (suggestion) => {
    setQuery(suggestion);
    setDropDown(false);
  };

  return (
    <>
      {dropDown && <div id="dropdown-overlay" onClick={() => setDropDown(false)}></div>}

      <div id="search-main-container">
        <div id="search-bar">
          <IoSearch className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onClick={() => setDropDown(true)}
            placeholder="Search by Title or Tags!"
          />

          {dropDown && (
            <div id="search-dropdown">
              <h1 style={{ paddingLeft: "20px" }}>Search for Pins Using Keyword {query ? `"${query}"` : '' } </h1>
              {query ? (
                searchedPins.length > 0 ? (
                  <ul id="search-dropdown-list">
                    {searchedPins.slice(0, 12).map((pin) => (
                      <li key={pin.id} className="search-dropdown-item">
                        <PinItemsSearchBar
                          pin={pin}
                          onClick={() => {
                            setQuery(pin.title);
                            setDropDown(false);
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-results">No results found.</p>
                )
              ) : (
                <ul id="search-dropdown-list">
                  {combinedPins.map((pin) => (
                    <li key={pin.id} className="search-dropdown-item">
                      <PinItemsSearchBar
                        pin={pin}
                        onClick={() => {
                          setQuery(pin.title);
                          setDropDown(false);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              )}
              {/* <hr />
              <SearchQuery query={query} pins={pinsArray} onSelect={handleSuggestionWord} /> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchBar;
