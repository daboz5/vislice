import "./Button.css";

const Button = ({children, button, onClick}) => {
    
    return (
        <button
            className={button === "normal" ? "button-normal" : "button-subtle"}
            onClick={onClick}    
        >
            {children}
        </button>
    )
}

export default Button;