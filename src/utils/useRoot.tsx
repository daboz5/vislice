import useAppStore from "../Store"

export default function useRoot() {

    const { darkMode } = useAppStore();

    const boxShadowStyleBtnDef = (
        `1px -1px 2px 1px ghostwhite,
        -1px 2px 5px 1px black`
    )

    const boxShadowStyleBtn = (
        darkMode ?
            `0 0 2px 1px ghostwhite` :
            `1px -1px 2px 1px ghostwhite,
            -1px 2px 5px 1px black`
    )

    const handleBtnClickStyle = (
        element:
            EventTarget & HTMLButtonElement |
            EventTarget & HTMLAnchorElement |
            EventTarget & HTMLLabelElement,
        action: boolean,
        darkModeDef?: boolean
    ) => {
        if (action) {
            element.style.boxShadow = "none";
        } else if (darkModeDef) {
            element.style.boxShadow = boxShadowStyleBtnDef;
        } else {
            element.style.boxShadow = boxShadowStyleBtn;
        }
    }

    return {
        boxShadowStyleBtnDef,
        boxShadowStyleBtn,
        handleBtnClickStyle
    }
}