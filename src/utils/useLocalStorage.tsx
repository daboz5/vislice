export default function useLocalStorage () {

    const storeData = (key:string, newData:any):void => {
        try {
            localStorage.setItem(key, JSON.stringify(newData));
        } catch (error) {
            console.log(error)
        }
    };

    const getData = (key:string):any => {
        try {
            return JSON.parse(localStorage.getItem(key) || "{}");
        } catch (error) {
            console.log(error)
        }
    }

    const removeData = (key:string):void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.log(error)
        }
    }

    return { storeData, getData, removeData };
}