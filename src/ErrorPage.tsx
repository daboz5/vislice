import { useRouteError } from "react-router-dom";
import "./ErrorPage.css"

export default function ErrorPage() {
  const error:any = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Oprostite, zgodila se je nepričakovana težava.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}