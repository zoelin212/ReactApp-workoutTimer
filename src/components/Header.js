import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faClock, faChartColumn} from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";

const Header = () => {

    return(
        <header>
            <Link to="/timer"><FontAwesomeIcon icon={faClock} /></Link>
            <Link to="/report"><FontAwesomeIcon icon={faChartColumn} /></Link>
        </header>
    );
}

export default Header;