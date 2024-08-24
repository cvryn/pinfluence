import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchPins } from '../../redux/pinReducer';
import './PinItems.css';
import { Link, NavLink } from "react-router-dom";

function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;


    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

function PinItems({ pins }) {
  const dispatch = useDispatch();
  const allPins = useSelector((state) => state.pin.allPins);
  const [shuffledPins, setShuffledPins] = useState([]);

  useEffect(() => {
    dispatch(fetchPins());
  }, [dispatch]);

  useEffect(() => {
    if (allPins) {
      setShuffledPins(shuffleArray([...allPins]));
    }
  }, [allPins]);

  return (
    <div id="pin-items-container">
      {shuffledPins.length > 0 ? (
        shuffledPins.map(pin => (
          <Link Link key={pin.id} to={`/pins/${pin.id}`} className="pin-item">
            <img src={pin.image_url} alt={pin.title} />
            <div className="pin-item-content">

            </div>
          </Link>
        ))
      ) : (
        <p>No pins available.</p>
      )}
    </div>

  );
}

export default PinItems;
