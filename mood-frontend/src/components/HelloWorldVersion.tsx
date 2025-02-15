import useAppVersion from "../hooks/useAppVersion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function HelloWorldVersion() {
  const { version, error, isLoading } = useAppVersion();

  return (
    <>
      {isLoading && (
        <p>
          <FontAwesomeIcon icon={faSpinner} spin /> Loading...
        </p>
      )}
      {error && <p>Error: {error.message}</p>}
      {version && (
        <p>
          Mood version: <code>{version}</code>
        </p>
      )}
    </>
  );
}

export default HelloWorldVersion;
