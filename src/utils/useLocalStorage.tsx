export default function useLocalStorage () {

    const storeData = (key: string, newData: boolean | string) => {
        try {
            localStorage.setItem(key, JSON.stringify(newData));
        } catch (error) {
            console.log(error)
        }
    };

    const getData = (key: string) => {
        try {
            return JSON.parse(localStorage.getItem(key) || "null");
        } catch (error) {
            console.log(error)
        }
    }

    const removeData = (key: string) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.log(error)
        }
    }

    return { storeData, getData, removeData };
}