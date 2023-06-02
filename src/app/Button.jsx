import { Link } from 'react-router-dom';
import "./Button.css";

const Button = ({children, button, onClick, to, onChange}) => {

    return (
        <div>
            {button === "img" ?
                (<label>
                    <span
                        className="previewImgBtn">
                            {children}
                    </span>
                    <input
                        type="file"
                        className="previewImgBtnHide"
                        onChange={onChange}
                        onClick={onClick}
                        accept="image/png, image/jpeg, image/webp">
                    </input>
                </label>) :

                <Link
                    className={
                        button === "normal" ?
                            "button-normal" :
                                button === "subtle" ?
                                    "button-subtle" :
                                        "button-normal"
                    }
                    to={to}
                    onClick={onClick}
                    rel="noopener noreferrer"
                    >
                    {children}
                </Link>
            }
        </div>
    )
}

export default Button;