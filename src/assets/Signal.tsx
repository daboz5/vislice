import { createUseStyles } from "react-jss";

export default function Signal() {

  const styles = createUseStyles({
    cls3: {
      fill: "none",
      stroke: "#000",
      strokeMiterlimit: "10",
      strokeWidth: "25px",
      animation: '$signal3 1s infinite'
    },
    cls2: {
      fill: "none",
      stroke: "#000",
      strokeMiterlimit: "10",
      strokeWidth: "20px",
      animation: '$signal2 1s infinite'
    },
    cls1: {
      fill: "none",
      stroke: "#000",
      strokeMiterlimit: "10",
      strokeWidth: "15px",
      animation: '$signal1 1s infinite'
    },
    '@keyframes signal1': {
      "0%, 100%": {
        opacity: 0
      },
      "25%, 50%": {
        opacity: 1
      },
      "75%": {
        opacity: 0.3
      }
    },
    '@keyframes signal2': {
      "0%, 25%": {
        opacity: 0
      },
      "50%, 75%": {
        opacity: 1
      },
      "100%": {
        opacity: 0.3
      }
    },
    '@keyframes signal3': {
      "75%, 100%": {
        opacity: 1
      },
      "0%": {
        opacity: 0.3
      },
      "25%, 50%": {
        opacity: 0
      }
    },
  })

  const classes = styles();

  return (<>
    <svg id="signalIcon" data-name="signalIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 258 129">
      <path className={classes.cls3} d="m245.5,129c0-64.341-52.159-116.5-116.5-116.5S12.5,64.659,12.5,129" />
      <path className={classes.cls2} d="m209,129c0-44.183-35.817-80-80-80s-80,35.817-80,80" />
      <path className={classes.cls1} d="m175,129c0-25.405-20.595-46-46-46s-46,20.595-46,46" />
      <circle cx="129" cy="128.5" r="21.5" />
    </svg>
  </>)
}