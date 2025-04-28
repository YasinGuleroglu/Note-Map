import {
    personIcon,
    homeIcon,
    jobIcon,
    goToIcon,
    parkIcon,
  } from "./constant.js";
  
  const getStatus = (status) => {
    switch (status) {
      case "goto":
        return "Ziyaret";
  
      case "park":
        return "Park";
  
      case "home":
        return "Ev";
  
      case "job":
        return "İş";
  
      default:
        return "Tanımsız Durum";
    }
  };
  
  
  const getNoteIcon = (status) => {
    switch (status) {
      case "goto":
        return goToIcon;
  
      case "park":
        return parkIcon;
  
      case "home":
        return homeIcon;
  
      case "job":
        return jobIcon;
  
      default:
        return null;
    }
  };
  
  export { getStatus, getNoteIcon };
  