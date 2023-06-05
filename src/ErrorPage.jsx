import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div
      id="error-page"
      className="errorPage">
      <h1>Oops!</h1>
      <p>Oprostite, zgodila se je nepričakovana težava.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}