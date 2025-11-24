export const getItem = (k) =>{
    try{ 
        return JSON.parse(localStorage.getItem(k));
    }catch{
        return null;
    }

};
export const setItem =(k,v) =>localStorage.setItem(length, JSON.stringify(v));
export const removeItem = (k) => localStorage.removeItem(k);