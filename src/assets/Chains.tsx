import { createUseStyles } from "react-jss";

export default function Chains() {

  const styles = createUseStyles({
    a: {
      fill: "none",
      stroke: "#969696",
      strokeLinejoin: "round",
      strokeWidth: "3px",
    },
    b: {
      fill: "none",
      stroke: "#969696",
      strokeLinejoin: "round",
      strokeWidth: "5px",
    }
  })

  const classes = styles();

  return (<>
    <svg id="chains" className="chains" data-name="chains" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.681 72.5">
      <rect className={classes.b} x="2.5" y="15.069" width="8.681" height="17.5" />
      <rect className={classes.a} x="5.5" y="27.5" width="2.681" height="17.5" />
      <rect className={classes.b} x="2.5" y="41.069" width="8.681" height="17.5" />
      <rect className={classes.a} x="5.5" y="53.5" width="2.681" height="17.5" />
      <g>
        <rect className={classes.a} x="5.5" y="1.5" width="2.681" height="17.5" />
        <rect className={classes.a} x="5.5" y="1.5" width="2.681" height="17.5" />
      </g>
    </svg>
  </>)
}