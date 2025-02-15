import useGreeting from "../hooks/useGreeting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function HelloWorldGreeting() {
  const { greeting, error, isLoading } = useGreeting();

  return (
    <>
      {isLoading && (
        <p>
          <FontAwesomeIcon icon={faSpinner} spin /> Loading...
        </p>
      )}
      {error && <p>Error: {error.message}</p>}
      {greeting && (
        <p>
          The server says: <code>{greeting}</code>
        </p>
      )}
    </>
  );
}

export default HelloWorldGreeting;
