// ServicesCard.jsx
import React from 'react';
import { useTranslation } from "react-i18next"; 
import i18n from "../../../Language/translate";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function ServicesCard({ services, onServiceClick }) {
  const { t } = useTranslation();
  const isArabic = i18n.language === 'ar';
  return services.map((service, idx) => (
    <div key={idx} className="w-[100%] md:w-[45%] lg:w-[30%] h-full  mb-5">
      <div
        onClick={() => onServiceClick(service)}
        className="text-2xl hover:underline cursor-pointer"
      >
        <div className="bg-gray-200  h-full p-5 flex justify-center mb-3 hover:bg-gray-100">
          <img
            src={service.image_url}
            alt={service.title}
            width={120}
            height={120}
          />
        </div>
        <div className="container flex items-center ml-5 mb-3">
          {t(service.title)}
          {isArabic ? <ArrowBackIcon className="w-8 h-6 mt-2 ml-2" /> : (
            <svg
              className="w-8 h-6 mt-2 ml-2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          )}
        </div>
      </div>
    </div>
  ));
}

export default ServicesCard;
