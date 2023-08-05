import { createUseStyles } from "react-jss";
import useAppStore from "../Store";

export default function BulbIcon() {

  const {
    bulbOn,
    help,
    darkMode,
    switchBulbOn,
    switchHelp
  } = useAppStore();

  const styles = createUseStyles({
    b: { fill: "rgb(50, 50, 50)" },
    c: { fill: "none" },
    d: { fill: "none" }
  })

  const classes = styles();

  const handleClick = () => {
    switchHelp();
    help && !bulbOn && switchBulbOn();
  }

  return (<>
    <svg
      id="a"
      onMouseEnter={() => { !help && switchBulbOn() }}
      onMouseLeave={() => { !help && switchBulbOn() }}
      onClick={() => handleClick()}
      onMouseDown={() => { document.getElementById("infoBtnBox")?.classList.remove("pull") }}
      onMouseUp={() => { document.getElementById("infoBtnBox")?.classList.add("pull") }}
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 183 277.1">
      <g>
        <circle
          className={classes.c}
          cx="91.5"
          cy="91.5"
          r="84.5"
          transform="translate(-13.475 167.162) rotate(-80.783)"
        />
        <path
          className={classes.d}
          d="m91.5,14c42.734,0,77.5,34.766,77.5,77.5s-34.766,77.5-77.5,77.5S14,134.234,14,91.5,48.766,14,91.5,14m0-14C40.966,0,0,40.966,0,91.5s40.966,91.5,91.5,91.5,91.5-40.966,91.5-91.5S142.034,0,91.5,0h0Z"
        />
      </g>
      <path className={classes.b} d="m91.5,236l-38.6-.083c0,.028,0,.055,0,.083,0,21.175,17.425,38.6,38.6,38.6s38.6-17.425,38.6-38.6h-38.6Z" />
      <rect className={classes.b} x="46.5" y="213" width="90" height="14" rx="7" ry="7" />
      <rect className={classes.b} x="46.5" y="190" width="90" height="14" rx="7" ry="7" />
      <rect className={classes.b} x="46.5" y="167" width="90" height="14" rx="7" ry="7" />
    </svg>
    <div
      id="lightSourceBox"
      style={
        {
          backgroundColor: help ? "yellow" : darkMode ?
            "#000B60" :
            "#5EC4FF",
          boxShadow: bulbOn ?
            "0 0 5px 2px gold, 0 0 15px 5px gold" :
            "none"
        }
      }>
      <div
        id="lightSource"
        style={
          {
            backgroundColor: bulbOn ?
              "rgb(255, 255, 255)" :
              "rgb(0, 0, 50)",
            boxShadow: bulbOn ?
              "0 0 10px 5px white, inset 0 0 3px 1px yellow" :
              "none"
          }
        }>
      </div>
    </div>
  </>)
}