import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_SERVER_URL;
const CLOUDINARY_ID = import.meta.env.VITE_APP_CLOUDINARY_ID;
export const getCustomerInfo = async (token) => {
  try {
    const res = await axios.get(`/customers/get-customer/${token}`);
    return res.data.customer;
  } catch (error) {
    console.log(error);
  }
};

export const API = axios.create({
  baseURL: API_URL,
  responseType: 'json',
});

export const apiRequest = async ({ url, token, data, method }) => {
  try {
    const result = await API(url, {
      method: method || 'GET',
      data: data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return result;
  } catch (error) {
    const err = error.response.data;
    console.log(err);
    return { status: err.success, message: err.message };
  }
};

export const handleFileUpload = async (uploadFile) => {
  const formData = new FormData();
  formData.append('file', uploadFile);
  formData.append('upload_preset', 'Smart Vision');
  console.log(formData);
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_ID}/image/upload/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: null,
        },
      }
    );
    console.log(response.data);
    return response.data.secure_url;
  } catch (error) {
    console.log(error);
  }
};

//take care about this in Multiple Files Upload
//const [image, setImage] = useState([{}]);
export const handleMultipleFilesUpload = async (uploadFile) => {
  try {
    const files = [];
    for (let i = 0; i < 4; i++) {
      const formData = new FormData();
      formData.append('file', uploadFile[i]);
      formData.append('upload_preset', 'Smart Vision');
      await axios
        .post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_ID}/image/upload/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: null,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          files.push(response.data.secure_url);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return files;
  } catch (error) {
    console.log(error);
  }
};

// to translation
export function setOptionsForTranslate(texts) {
  const data = texts?.map((item) => {
    return { Text: item };
  });
  const options = {
    method: 'POST',
    url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
    params: {
      'to[0]': 'ar',
      'to[1]': 'en',
      'api-version': '3.0',
      profanityAction: 'NoAction',
      textType: 'plain',
    },
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': import.meta.env.VITE_APP_X_RapidAPI_Key,
      'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
    },
    data,
  };
  //console.log(options);
  return options;
}

// to translation materials name
export function setOptionsForTranslateMaterials(materials) {
  const data = materials?.map((item) => {
    return { Text: item.material };
  });

  const options = {
    method: 'POST',
    url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
    params: {
      'to[0]': 'ar',
      'to[1]': 'en',
      'api-version': '3.0',
      profanityAction: 'NoAction',
      textType: 'plain',
    },
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': import.meta.env.VITE_APP_X_RapidAPI_Key,
      'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
    },
    data,
  };
  //console.log(options);
  return options;
}
