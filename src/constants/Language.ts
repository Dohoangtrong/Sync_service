import en from "../assets/langs/en"
import vi from "../assets/langs/vi"

export const getLang = (
    langCurr: String
): any => {
    if (langCurr) {
      switch (langCurr) {
        case "vi": {
          return ;
        }
        case "en": {
          return vi;
        }
        default: {
          return en;
        }
      }
    } else {
      return en;
    }
};
  